import { useState, useCallback } from 'react';
import type { Toast, ToastType } from '../components/NotificationToast';

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface UseNotificationsReturn {
  toasts: Toast[];
  notify: (type: ToastType, title: string, message?: string, duration?: number) => void;
  dismiss: (id: string) => void;
  clear: () => void;
}

export default function useNotifications(): UseNotificationsReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback(
    (type: ToastType, title: string, message?: string, duration = 4000) => {
      setToasts((prev) => [
        ...prev.slice(-9), // cap at 10 visible
        { id: uid(), type, title, message, duration },
      ]);
    },
    [],
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clear = useCallback(() => setToasts([]), []);

  return { toasts, notify, dismiss, clear };
}
