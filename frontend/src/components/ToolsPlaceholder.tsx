import styles from './ToolsPlaceholder.module.css'

const UPCOMING = [
  'Tool Calling (function calling via LLM)',
  'Web Search Integration',
  'Calendar & Reminder Tool',
  'Code Execution Sandbox',
  'Automation Workflow Builder',
  'Local Vector Memory / RAG',
]

export default function ToolsPlaceholder() {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>FUTURE TOOLS</span>
        <span className={styles.badge}>COMING SOON</span>
      </div>
      <ul className={styles.list}>
        {UPCOMING.map(tool => (
          <li key={tool} className={styles.item}>
            <span className={styles.dot} />
            {tool}
          </li>
        ))}
      </ul>
    </div>
  )
}
