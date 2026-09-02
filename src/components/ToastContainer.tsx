import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  return (
    <div 
      id="toast-container"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            id={`toast-item-${t.id}`}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3.5 rounded-lg shadow-xl border bg-[#1F1D1A] text-[#FAF8F5] border-[#3C3833] text-sm"
          >
            <div className="flex items-center gap-2.5">
              {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#D4A373] shrink-0" />}
              {t.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
              {t.type === 'info' && <Info className="w-4 h-4 text-[#D8CFC4] shrink-0" />}
              {t.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
              <span className="font-medium leading-snug">{t.message}</span>
            </div>
            <button
              id={`toast-close-${t.id}`}
              onClick={() => removeToast(t.id)}
              className="text-[#9E968D] hover:text-white transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
