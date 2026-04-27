import { useState } from 'react'
import ChatPanel, { type Message } from '@/components/ChatPanel'
import ImageUploadPanel from '@/components/ImageUploadPanel'
import VoicePanel from '@/components/VoicePanel'
import ToolsPlaceholder from '@/components/ToolsPlaceholder'
import StatusBar from '@/components/StatusBar'
import { useBackendStatus } from '@/hooks/useBackendStatus'
import { sendPrompt, sendVoiceCommand, analyzeImage } from '@/services/api'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { status, latencyMs } = useBackendStatus()

  // Chat state
  const [messages, setMessages] = useState<Message[]>([])
  const [chatLoading, setChatLoading] = useState(false)

  // Voice state
  const [voiceResult, setVoiceResult] = useState('')
  const [voiceLoading, setVoiceLoading] = useState(false)

  // Image state
  const [imageInsight, setImageInsight] = useState('')
  const [imageLoading, setImageLoading] = useState(false)

  async function handleChatSend(text: string) {
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setChatLoading(true)
    try {
      const res = await sendPrompt(text)
      setMessages(prev => [...prev, { role: 'assistant', content: res.content }])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${msg}` }])
    } finally {
      setChatLoading(false)
    }
  }

  async function handleVoiceCommand(transcript: string) {
    setVoiceLoading(true)
    try {
      const res = await sendVoiceCommand(transcript)
      setVoiceResult(res.result)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setVoiceResult(`Error: ${msg}`)
    } finally {
      setVoiceLoading(false)
    }
  }

  async function handleImageAnalyze(file: File, prompt: string) {
    setImageLoading(true)
    setImageInsight('')
    try {
      const res = await analyzeImage(file, prompt)
      setImageInsight(res.insight)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setImageInsight(`Error: ${msg}`)
    } finally {
      setImageLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Top status bar */}
      <div className={styles.statusRow}>
        <StatusBar status={status} latencyMs={latencyMs} />
      </div>

      {/* Main grid */}
      <div className={styles.grid}>
        {/* Chat — large */}
        <div className={styles.chatCell}>
          <ChatPanel
            messages={messages}
            loading={chatLoading}
            onSend={handleChatSend}
          />
        </div>

        {/* Right column */}
        <div className={styles.sideColumn}>
          <VoicePanel
            onCommand={handleVoiceCommand}
            lastResult={voiceResult}
            loading={voiceLoading}
          />
          <ImageUploadPanel
            onAnalyze={handleImageAnalyze}
            insight={imageInsight}
            loading={imageLoading}
          />
          <ToolsPlaceholder />
        </div>
      </div>
    </div>
  )
}
