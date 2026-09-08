'use client';

import React, { useEffect, useState } from 'react';
import { subscribeMagicToast, type MagicToastItem } from '@/lib/magic-motion';
import { ShoppingBag, X } from 'lucide-react';

export const MagicToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<MagicToastItem[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeMagicToast((newToast) => {
      setToasts((prev) => [...prev, newToast]);

      // Automatically remove after 3.5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3500);
    });

    return unsubscribe;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="magic-toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="magic-toast">
          {/* Thumbnail Icon */}
          <div className="toast-thumb">{toast.emoji}</div>

          {/* Toast Info */}
          <div className="toast-info">
            <div className="toast-title">{toast.title}</div>
            <div className="toast-desc">{toast.desc}</div>
          </div>

          {/* Action Button */}
          {toast.actionText && toast.onAction && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.onAction?.();
                setToasts((prev) => prev.filter((t) => t.id !== toast.id));
              }}
              className="toast-action-btn"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{toast.actionText}</span>
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-full transition-colors ml-1"
            title="Tutup Notifikasi"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Countdown Progress Bar */}
          <div className="toast-progress" />
        </div>
      ))}
    </div>
  );
};
