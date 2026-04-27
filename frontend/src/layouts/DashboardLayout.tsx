import styles from './DashboardLayout.module.css'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoAimad}>AIMAD</span>
          <span className={styles.logoPronunciation}>pronounced: e y e mad</span>
        </div>
        <p className={styles.tagline}>
          "Jarvis from Iron Man isn't science fiction anymore, I'm building it from scratch&nbsp;;)"
        </p>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <span>AIMAD &copy; 2026 — Eduardo J. Barrios</span>
        <span className={styles.footerStatus}>SYSTEM ONLINE</span>
      </footer>
    </div>
  )
}
