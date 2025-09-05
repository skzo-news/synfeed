// src/UpdateBanner.jsx
import React, { useEffect, useState } from 'react';

export default function UpdateBanner() {
  const [state, setState] = useState('idle'); // idle | checking | available | downloaded | error
  const [progress, setProgress] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const off1 = window.updater.onStatus((d) => {
      setState(d.state);
      if (d.state === 'error') setMessage(d.message || 'Update error');
      if (d.state !== 'available') setProgress(null);
    });
    const off2 = window.updater.onProgress((p) => setProgress(p));
    return () => {
      off1?.();
      off2?.();
    };
  }, []);

  const label = (() => {
    if (state === 'checking') return 'Checking for updates…';
    if (state === 'available') return 'Downloading update…';
    if (state === 'downloaded') return 'Update ready — installing…';
    if (state === 'error') return `Update error: ${message}`;
    return 'Auto-update enabled';
  })();

  return (
    <div className="flex items-center gap-2 text-xs text-slate-400">
      <span>{label}</span>
      {progress && (
        <span>{Math.round(progress.percent || 0)}%</span>
      )}
      <button
        className="px-2 py-1 rounded border border-slate-700 hover:bg-slate-800 text-slate-300"
        onClick={() => window.updater.check()}
        disabled={state === 'checking'}
        title="Check for updates now"
      >
        Check
      </button>
    </div>
  );
}
