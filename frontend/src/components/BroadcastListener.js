import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { adminAPI } from '../utils/api';
import { useGameStore } from '../utils/store';
import { FiInfo, FiAlertTriangle, FiAlertCircle, FiCheckCircle, FiX, FiRadio } from 'react-icons/fi';

const BASE_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'https://aws-event1.linkpc.net';

const typeConfig = {
  info:    { icon: FiInfo,         bg: 'bg-[#7C3AED]/10', border: 'border-[#7C3AED]/30', text: 'text-[#7C3AED]',  label: 'Announcement' },
  warning: { icon: FiAlertTriangle, bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/30', text: 'text-[#F59E0B]', label: 'Warning' },
  alert:   { icon: FiAlertCircle,  bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/30', text: 'text-[#EF4444]',  label: 'Critical Alert' },
  success: { icon: FiCheckCircle,  bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/30', text: 'text-[#10B981]',  label: 'Success' },
};

const BroadcastListener = () => {
  const { isLoggedIn, teamId } = useGameStore();
  const [toasts, setToasts] = useState([]);
  const socketRef = useRef(null);
  const lastSeenRef = useRef(null);

  const addToast = useCallback((broadcast) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev.slice(-4), { ...broadcast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 12000);
  }, []);

  useEffect(() => {
    if (!isLoggedIn || teamId === 'ADMIN-EVENT-2026') return;

    const socket = io(BASE_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join-event', teamId);
    });

    socket.on('broadcast', (data) => {
      addToast(data);
    });

    // Fetch any broadcasts we might have missed while offline
    const fetchExisting = async () => {
      try {
        const res = await adminAPI.getBroadcasts();
        const broadcasts = res.data.broadcasts || [];
        if (broadcasts.length > 0) {
          const latest = broadcasts[broadcasts.length - 1];
          lastSeenRef.current = new Date(latest.timestamp).getTime();
        }
      } catch {}
    };
    fetchExisting();

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isLoggedIn, teamId, addToast]);

  const dismiss = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-[16px] right-[16px] z-[9999] flex flex-col gap-[8px]" style={{ maxWidth: '400px' }}>
      {toasts.map((toast, i) => {
        const config = typeConfig[toast.type] || typeConfig.info;
        const Icon = config.icon;
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-[12px] p-[16px] rounded-[12px] border shadow-2xl backdrop-blur-md ${config.bg} ${config.border}`}
            style={{
              animation: 'slideInRight 0.4s ease-out forwards',
              animationDelay: `${i * 0.05}s`,
            }}
          >
            <div className={`shrink-0 mt-[2px] ${config.text}`}>
              <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-[6px] mb-[4px]">
                <FiRadio size={10} className={`${config.text} animate-pulse`} />
                <p className={`text-[10px] font-bold uppercase tracking-[0.15em] ${config.text}`}>
                  {config.label}
                </p>
              </div>
              <p className="text-[14px] font-medium text-[#F9FAFB] leading-[1.5]">{toast.message}</p>
              {toast.timestamp && (
                <p className="text-[10px] text-[#6B7280] mt-[4px]">
                  {new Date(toast.timestamp).toLocaleTimeString()}
                </p>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-[#6B7280] hover:text-[#F9FAFB] shrink-0 transition-colors"
            >
              <FiX size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default BroadcastListener;
