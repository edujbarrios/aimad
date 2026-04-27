import { useState, useRef, type FormEvent } from 'react'
import styles from './ChatPanel.module.css'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatPanelProps {
  messages: Message[]
  loading: boolean
  onSend: (text: string) => void
}

export default function ChatPanel({ messages, loading, onSend }: ChatPanelProps) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || loading) return
    onSend(trimmed)
    setInput('')
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80)
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>CHAT INTERFACE</span>
      </div>

      <div className={styles.messages}>
        {messages.length === 0 && (
          <p className={styles.empty}>Awaiting input, sir.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`${styles.msg} ${styles[m.role]}`}>
            <span className={styles.roleLabel}>{m.role === 'user' ? 'YOU' : 'AIMAD'}</span>
            <p className={styles.content}>{m.content}</p>
          </div>
        ))}
        {loading && (
          <div className={`${styles.msg} ${styles.assistant}`}>
            <span className={styles.roleLabel}>AIMAD</span>
            <p className={styles.thinking}>Processing<span className={styles.dots}>...</span></p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          placeholder="Enter command or query..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          autoComplete="off"
          spellCheck={false}
        />
        <button className="btn-cyber" type="submit" disabled={loading || !input.trim()}>
          SEND
        </button>
      </form>
    </div>
  )
}
