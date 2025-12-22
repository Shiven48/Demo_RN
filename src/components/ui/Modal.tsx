import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import type { ModalType } from '@/lib/types';

interface ModalProps {
  visible: boolean;
  type: ModalType;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  children?: ReactNode;
}

const iconConfig = {
  success: { icon: CheckCircle, color: '#10B981', bg: 'bg-emerald-50' },
  error: { icon: AlertCircle, color: '#EF4444', bg: 'bg-red-50' },
  warning: { icon: AlertTriangle, color: '#F59E0B', bg: 'bg-amber-50' },
};

export default function Modal({
  visible,
  type,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  children,
}: ModalProps) {
  const { icon: Icon, color, bg } = iconConfig[type];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} color="#9CA3AF" />
            </button>

            {/* Icon */}
            <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Icon size={32} color={color} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{title}</h3>

            {/* Message */}
            <p className="text-gray-500 text-center text-sm leading-relaxed mb-6">{message}</p>

            {/* Children */}
            {children}

            {/* Actions */}
            <div className="flex gap-3">
              {onConfirm && (
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-full font-semibold text-gray-700 hover:bg-gray-50"
                >
                  {cancelText}
                </button>
              )}
              <button
                onClick={onConfirm || onClose}
                className="flex-1 py-3 px-4 bg-btn-active rounded-full font-semibold text-white hover:bg-gray-800"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

