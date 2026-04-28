import { useEffect, useRef, useState } from 'react';
import { adminAPI } from '../utils/api';
import { useGameStore } from '../utils/store';
import { FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';

const BroadcastListener = () => {
  const { isLoggedIn, teamId } = useGameStore();
  const [toasts, setToasts] = useState([]);
  const lastSeenRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn || teamId === 'ADMIN-EVENT-2026') return;

    const check = async () => {
      try {
        const res = await adminAPI.getSettings();
        const broadcasts = res.data.broadcasts || [];
        if (broadcasts.length === 0) return;

        const latest = broadcasts[broadcasts.length - 1];
        const latestTime = new Date(latest.timestamp).getTime();

        if (lastSeenRef.current === null) {
          lastSeenRef.current = latestTime;
          return;
        }

        if (latestTime > lastSeenRef.current) {
          lastSeenRef.current = latestTime;
          const id = Date.now();
          setToasts(prev => [...prev, { ...latest, id }]);
          setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
          }, 10000);
        }
      } catch {}
    };

    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, [isLoggedIn, teamId]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-16 z-[200] flex flex-col gap-8 max-w-sm">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-start gap-12 p-16 rounded-xl border shadow-2xl backdrop-blur-md animate-in slide-in-from-right duration-500 ${
            toast.type === 'warning'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : toast.type === 'danger'
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary'
          }`}
        >
          {toast.type === 'warning' || toast.type === 'danger'
            ? <FiAlertTriangle size={18} className="shrink-0 mt-[2px]" />
            : <FiInfo size={18} className="shrink-0 mt-[2px]" />
          }
          <div className="flex-1">
            <p className="text-10 font-bold uppercase tracking-widest mb-4 opacity-70">Admin Broadcast</p>
            <p className="text-14 font-semibold text-brand-text-primary leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            className="text-brand-text-muted hover:text-brand-text-primary shrink-0"
          >
            <FiX size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default BroadcastListener;
