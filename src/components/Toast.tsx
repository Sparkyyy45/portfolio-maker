'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastVariant = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onDismiss: () => void;
}

const variantStyles: Record<ToastVariant, { icon: React.ReactNode; border: string; bg: string; text: string }> = {
  success: {
    icon: <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />,
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
  },
  error: {
    icon: <XCircle size={16} className="text-rose-600 shrink-0" />,
    border: 'border-rose-200',
    bg: 'bg-rose-50',
    text: 'text-rose-800',
  },
  info: {
    icon: <Info size={16} className="text-blue-600 shrink-0" />,
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
  },
};

export default function Toast({ message, variant = 'info', duration = 4000, onDismiss }: ToastProps) {
  const [progress, setProgress] = useState(100);
  const style = variantStyles[variant];

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onDismiss();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [duration, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`relative flex items-center gap-2.5 px-4 py-3 rounded-lg border ${style.border} ${style.bg} shadow-lg max-w-sm overflow-hidden`}
    >
      {style.icon}
      <span className={`text-xs font-semibold ${style.text} flex-1`}>{message}</span>
      <button onClick={onDismiss} className="text-neutral-400 hover:text-neutral-600 transition shrink-0 cursor-pointer">
        <X size={14} />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-200/50">
        <div
          className={`h-full transition-none ${variant === 'success' ? 'bg-emerald-400' : variant === 'error' ? 'bg-rose-400' : 'bg-blue-400'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
}

/** Toast container — renders toasts at top-right of screen */
export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

export function ToastContainer({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            variant={toast.variant}
            onDismiss={() => onDismiss(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
