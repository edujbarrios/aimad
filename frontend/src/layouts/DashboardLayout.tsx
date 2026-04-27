import styles from './DashboardLayout.module.css'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const BUILD_ID = `v2.0.0-${new Date().getFullYear()}`

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className={styles.shell}>
      {/* Scan-line overlay */}
      <div className={styles.scanlines} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoAimad}>AIMAD</span>
          <span className={styles.logoPronunciation}>pronounced: e y e mad</span>
        </div>

        {/* Centre HUD bar */}
        <div className={styles.hudBar}>
          <span className={styles.hudItem}>◈ AI ASSISTANT</span>
          <span className={styles.hudDivider}>|</span>
          <span className={styles.hudItem}>LLM7.IO</span>
          <span className={styles.hudDivider}>|</span>
          <span className={styles.hudItem}>OFFLINE TTS/STT</span>
          <span className={styles.hudDivider}>|</span>
          <span className={styles.hudBuild}>{BUILD_ID}</span>
        </div>

        <p className={styles.tagline}>
          "Jarvis from Iron Man isn't science fiction anymore, I'm building it from scratch&nbsp;;)"
        </p>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <span>AIMAD &copy; 2026 — Eduardo J. Barrios</span>
        <span className={styles.footerLicense}>AGPL v3 — Open Source</span>
        <span className={styles.footerStatus}>● SYSTEM ONLINE</span>
      </footer>
    </div>
  )
}
