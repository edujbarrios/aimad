import { useEffect, useRef } from 'react';
import styles from './ActivityLog.module.css';

export type LogLevel = 'info' | 'success' | 'warn' | 'error' | 'system';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  detail?: string;
}

interface ActivityLogProps {
  entries: LogEntry[];
  maxVisible?: number;
}

const LEVEL_PREFIX: Record<LogLevel, string> = {
  info:    '[ INFO  ]',
  success: '[ OK    ]',
  warn:    '[ WARN  ]',
  error:   '[ ERROR ]',
  system:  '[ SYS   ]',
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function ActivityLog({ entries, maxVisible = 50 }: ActivityLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const visible = entries.slice(-maxVisible);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>ACTIVITY LOG</span>
        <span className={styles.count}>{entries.length} events</span>
      </div>
      <div className={styles.logWindow}>
        {visible.length === 0 ? (
          <div className={styles.empty}>
            <span>// awaiting system events...</span>
          </div>
        ) : (
          visible.map((entry) => (
            <div
              key={entry.id}
              className={`${styles.entry} ${styles[entry.level]}`}
            >
              <span className={styles.time}>{formatTime(entry.timestamp)}</span>
              <span className={styles.prefix}>{LEVEL_PREFIX[entry.level]}</span>
              <span className={styles.message}>{entry.message}</span>
              {entry.detail && (
                <span className={styles.detail}>{entry.detail}</span>
              )}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
