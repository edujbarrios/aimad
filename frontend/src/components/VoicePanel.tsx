import styles from './VoicePanel.module.css'

interface VoicePanelProps {
  onCommand: (transcript: string) => void
  lastResult: string
  loading: boolean
}

import { useState } from 'react'

export default function VoicePanel({ onCommand, lastResult, loading }: VoicePanelProps) {
  const [transcript, setTranscript] = useState('')

  function handleSend() {
    const t = transcript.trim()
    if (!t || loading) return
    onCommand(t)
    setTranscript('')
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>VOICE COMMAND</span>
      </div>

      <div className={styles.body}>
        <p className={styles.hint}>
          Type a transcript or voice command below. Voice capture from microphone
          is handled server-side via the STT engine.
        </p>

        <div className={styles.inputRow}>
          <input
            className={styles.input}
            type="text"
            placeholder="Speak your command..."
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={loading}
            spellCheck={false}
          />
          <button className="btn-cyber" onClick={handleSend} disabled={loading || !transcript.trim()}>
            {loading ? '...' : 'EXECUTE'}
          </button>
        </div>

        {lastResult && (
          <div className={styles.result}>
            <span className={styles.resultLabel}>RESPONSE</span>
            <p className={styles.resultText}>{lastResult}</p>
          </div>
        )}
      </div>
    </div>
  )
}
