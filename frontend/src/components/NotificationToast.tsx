import { useEffect } from 'react';
import styles from './NotificationToast.module.css';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms, 0 = sticky
}

interface NotificationToastProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const ICONS: Record<ToastType, string> = {
  info:    '◈',
  success: '◆',
  warning: '◇',
  error:   '✕',
};

export default function NotificationToast({ toasts, onDismiss }: NotificationToastProps) {
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    toasts.forEach((t) => {
      if ((t.duration ?? 4000) > 0) {
        const timer = setTimeout(
          () => onDismiss(t.id),
          t.duration ?? 4000,
        );
        timers.push(timer);
      }
    });
    return () => timers.forEach(clearTimeout);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container} role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
        >
          <span className={styles.icon}>{ICONS[toast.type]}</span>
          <div className={styles.body}>
            <span className={styles.title}>{toast.title}</span>
            {toast.message && (
              <span className={styles.message}>{toast.message}</span>
            )}
          </div>
          <button
            className={styles.close}
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            ✕
          </button>
          <div className={styles.progressBar} />
        </div>
      ))}
    </div>
  );
}
