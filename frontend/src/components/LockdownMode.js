import React, { useEffect, useState } from 'react';

/**
 * Lockdown component that prevents cheating
 * - Detects tab switches
 * - Disables copy-paste
 * - Disables right-click
 * - Prevents F12 (DevTools)
 * - Warns on first 3 tab switches, auto-submits on 4th
 */
const LockdownMode = ({ onTabSwitch, onWarning }) => {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Track visibility (tab switch)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newCount = tabSwitchCount + 1;
        setTabSwitchCount(newCount);
        onTabSwitch(newCount);
        
        if (newCount >= 3) {
          onWarning(`Auto-submitting on 4th attempt (${4 - newCount} remaining)`);
        }
      }
    };

    // Disable copy
    const handleCopy = (e) => {
      e.preventDefault();
      alert('Copy-paste is disabled during the exam.');
    };

    // Disable paste
    const handlePaste = (e) => {
      e.preventDefault();
      alert('Copy-paste is disabled during the exam.');
    };

    // Disable right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
      alert('Right-click is disabled during the exam.');
    };

    // Disable F12 and other dev tools shortcuts
    const handleKeyDown = (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        alert('Developer tools are disabled during the exam.');
      }
    };

    // Request fullscreen
    const handleFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.warn('Fullscreen not available:', err);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Request fullscreen on mount
    handleFullscreen();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [tabSwitchCount, onTabSwitch, onWarning]);

  return null; // This component doesn't render anything, just manages security
};

export default LockdownMode;
