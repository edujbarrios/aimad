import { useRef, useState, type ChangeEvent } from 'react'
import styles from './ImageUploadPanel.module.css'

interface ImageUploadPanelProps {
  onAnalyze: (file: File, prompt: string) => void
  insight: string
  loading: boolean
}

export default function ImageUploadPanel({ onAnalyze, insight, loading }: ImageUploadPanelProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [prompt, setPrompt] = useState('Describe what you see in this image in detail.')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  function handleAnalyze() {
    if (file) onAnalyze(file, prompt)
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>IMAGE ANALYSIS</span>
      </div>

      <div className={styles.body}>
        {/* Drop zone */}
        <div
          className={`${styles.dropzone} ${preview ? styles.hasPreview : ''}`}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          {preview
            ? <img src={preview} alt="preview" className={styles.preview} />
            : <span className={styles.dropText}>DROP IMAGE / CLICK TO UPLOAD</span>
          }
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className={styles.fileInput}
            onChange={handleFile}
          />
        </div>

        {/* Prompt */}
        <textarea
          className={styles.promptInput}
          rows={2}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Analysis prompt..."
          spellCheck={false}
        />

        <button
          className="btn-cyber"
          onClick={handleAnalyze}
          disabled={!file || loading}
        >
          {loading ? 'ANALYZING...' : 'ANALYZE IMAGE'}
        </button>

        {/* Insight output */}
        {insight && (
          <div className={styles.insightBox}>
            <span className={styles.insightLabel}>INSIGHT</span>
            <p className={styles.insightText}>{insight}</p>
          </div>
        )}
      </div>
    </div>
  )
}
