import styles from './StatusBar.module.css'

interface StatusBarProps {
  status: 'online' | 'offline' | 'connecting'
  latencyMs?: number
}

const LABELS = {
  online:     'BACKEND ONLINE',
  offline:    'BACKEND OFFLINE',
  connecting: 'CONNECTING...',
}

export default function StatusBar({ status, latencyMs }: StatusBarProps) {
  return (
    <div className={`${styles.bar} ${styles[status]}`}>
      <span className={styles.dot} />
      <span className={styles.label}>{LABELS[status]}</span>
      {status === 'online' && latencyMs !== undefined && (
        <span className={styles.latency}>{latencyMs}ms</span>
      )}
    </div>
  )
}
