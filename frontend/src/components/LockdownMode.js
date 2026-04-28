import { useEffect, useRef, useState, useCallback } from 'react';
import { FiAlertTriangle, FiMaximize, FiShield } from 'react-icons/fi';

const LockdownMode = ({ onTabSwitch, onWarning }) => {
  const violationRef = useRef(0);
  const [warningText, setWarningText] = useState('');
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
  const warningTimer = useRef(null);

  const showWarning = useCallback((text) => {
    setWarningText(text);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    warningTimer.current = setTimeout(() => setWarningText(''), 3000);
  }, []);

  const handleViolation = useCallback((reason) => {
    violationRef.current += 1;
    const count = violationRef.current;
    onTabSwitch(count, reason);

    if (count < 3) {
      const msg = `${reason}. Warning ${count}/3 before disqualification.`;
      onWarning(msg);
      showWarning(msg);
    }
  }, [onTabSwitch, onWarning, showWarning]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) handleViolation('Tab switch detected');
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setShowFullscreenPrompt(true);
        handleViolation('Exited fullscreen');
      } else {
        setShowFullscreenPrompt(false);
      }
    };

    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
      showWarning('Back navigation is disabled.');
      onWarning('Back navigation is disabled.');
    };

    const handleCopy = (e) => { e.preventDefault(); showWarning('Copy is disabled.'); onWarning('Copy-paste disabled.'); };
    const handlePaste = (e) => { e.preventDefault(); showWarning('Paste is disabled.'); onWarning('Copy-paste disabled.'); };
    const handleContextMenu = (e) => { e.preventDefault(); showWarning('Right-click is disabled.'); onWarning('Right-click disabled.'); };

    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 'p') ||
        (e.ctrlKey && e.key === 's')
      ) {
        e.preventDefault();
        showWarning('This shortcut is disabled.');
        onWarning('Developer tools disabled.');
      }
    };

    const requestFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.warn('Fullscreen not available:', err);
      }
    };

    window.history.pushState(null, '', window.location.href);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    requestFullscreen();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      if (warningTimer.current) clearTimeout(warningTimer.current);
    };
  }, [handleViolation, showWarning, onWarning]);

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setShowFullscreenPrompt(false);
    } catch (err) {
      console.warn('Fullscreen denied:', err);
    }
  };

  return (
    <>
      {/* Warning Toast */}
      {warningText && (
        <div className="fixed top-[16px] left-1/2 -translate-x-1/2 z-[200] animate-slide-down">
          <div className="flex items-center gap-[10px] bg-danger/95 backdrop-blur-md text-white px-[20px] py-[12px] rounded-[12px] shadow-[0_8px_32px_rgba(239,68,68,0.3)] border border-danger/50 max-w-[480px]">
            <FiAlertTriangle size={18} className="shrink-0" />
            <span className="text-[13px] font-semibold">{warningText}</span>
          </div>
        </div>
      )}

      {/* Fullscreen Re-entry Overlay */}
      {showFullscreenPrompt && (
        <div className="fixed inset-0 z-[190] bg-black/90 backdrop-blur-xl flex items-center justify-center p-[24px]">
          <div className="bg-brand-surface border border-brand-border rounded-[20px] p-[40px] max-w-[420px] w-full text-center flex flex-col items-center gap-[20px] shadow-elevated animate-scale-in">
            <div className="w-[64px] h-[64px] bg-danger/10 rounded-[16px] flex items-center justify-center">
              <FiShield className="text-danger" size={28} />
            </div>
            <h2 className="text-[20px] font-bold text-brand-text-primary">Fullscreen Required</h2>
            <p className="text-[14px] text-brand-text-muted leading-[1.6]">
              You exited fullscreen mode. Return to fullscreen to continue your assessment. Repeated violations lead to disqualification.
            </p>
            <div className="text-[12px] font-mono text-danger font-bold">
              Violations: {violationRef.current} / 3
            </div>
            <button
              onClick={enterFullscreen}
              className="w-full flex items-center justify-center gap-[8px] bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold py-[14px] rounded-[12px] transition-colors active:scale-[0.98]"
            >
              <FiMaximize size={16} />
              Re-enter Fullscreen
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LockdownMode;
