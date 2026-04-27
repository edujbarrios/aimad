import { useState, useCallback } from 'react'
import ChatPanel, { type Message } from '@/components/ChatPanel'
import ImageUploadPanel from '@/components/ImageUploadPanel'
import VoicePanel from '@/components/VoicePanel'
import ToolsPlaceholder from '@/components/ToolsPlaceholder'
import StatusBar from '@/components/StatusBar'
import AssistantAvatar from '@/components/AssistantAvatar'
import ActivityLog, { type LogEntry, type LogLevel } from '@/components/ActivityLog'
import NotificationToast from '@/components/NotificationToast'
import SettingsPanel from '@/components/SettingsPanel'
import GlitchText from '@/components/GlitchText'
import { useBackendStatus } from '@/hooks/useBackendStatus'
import useNotifications from '@/hooks/useNotifications'
import { sendPrompt, sendVoiceCommand, analyzeImage } from '@/services/api'
import styles from './Dashboard.module.css'

function makeLogEntry(level: LogLevel, message: string, detail?: string): LogEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date(),
    level,
    message,
    detail,
  }
}

type AvatarStatus = 'idle' | 'thinking' | 'speaking' | 'listening'

export default function Dashboard() {
  const { status, latencyMs } = useBackendStatus()
  const { toasts, notify, dismiss } = useNotifications()

  // Chat state
  const [messages, setMessages] = useState<Message[]>([])
  const [chatLoading, setChatLoading] = useState(false)

  // Voice state
  const [voiceResult, setVoiceResult] = useState('')
  const [voiceLoading, setVoiceLoading] = useState(false)

  // Image state
  const [imageInsight, setImageInsight] = useState('')
  const [imageLoading, setImageLoading] = useState(false)

  // Avatar + Activity
  const [avatarStatus, setAvatarStatus] = useState<AvatarStatus>('idle')
  const [logEntries, setLogEntries] = useState<LogEntry[]>([
    makeLogEntry('system', 'AIMAD initialised', 'All subsystems nominal'),
  ])

  // Settings
  const [settingsOpen, setSettingsOpen] = useState(false)

  const addLog = useCallback((level: LogLevel, message: string, detail?: string) => {
    setLogEntries(prev => [...prev, makeLogEntry(level, message, detail)])
  }, [])

  async function handleChatSend(text: string) {
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setChatLoading(true)
    setAvatarStatus('thinking')
    addLog('info', `LLM prompt sent`, text.slice(0, 60) + (text.length > 60 ? '…' : ''))
    try {
      const res = await sendPrompt(text)
      setMessages(prev => [...prev, { role: 'assistant', content: res.content }])
      setAvatarStatus('speaking')
      addLog('success', 'LLM response received', `${res.content.length} chars`)
      setTimeout(() => setAvatarStatus('idle'), 2000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${msg}` }])
      setAvatarStatus('idle')
      addLog('error', 'LLM request failed', msg)
      notify('error', 'LLM Error', msg)
    } finally {
      setChatLoading(false)
    }
  }

  async function handleVoiceCommand(transcript: string) {
    setVoiceLoading(true)
    setAvatarStatus('listening')
    addLog('info', 'Voice command dispatched', transcript)
    try {
      const res = await sendVoiceCommand(transcript)
      setVoiceResult(res.result)
      setAvatarStatus('speaking')
      addLog('success', 'Voice command executed', res.result.slice(0, 60))
      notify('success', 'Voice Command', res.result.slice(0, 80))
      setTimeout(() => setAvatarStatus('idle'), 1500)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setVoiceResult(`Error: ${msg}`)
      setAvatarStatus('idle')
      addLog('error', 'Voice command failed', msg)
      notify('error', 'Voice Error', msg)
    } finally {
      setVoiceLoading(false)
    }
  }

  async function handleImageAnalyze(file: File, prompt: string) {
    setImageLoading(true)
    setImageInsight('')
    setAvatarStatus('thinking')
    addLog('info', `Image analysis started`, `${file.name} — "${prompt}"`)
    try {
      const res = await analyzeImage(file, prompt)
      setImageInsight(res.insight)
      setAvatarStatus('speaking')
      addLog('success', 'Image analysis complete', `${res.insight.length} chars returned`)
      notify('success', 'Analysis Complete', 'Image insight ready')
      setTimeout(() => setAvatarStatus('idle'), 2000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setImageInsight(`Error: ${msg}`)
      setAvatarStatus('idle')
      addLog('error', 'Image analysis failed', msg)
      notify('error', 'Image Analysis Error', msg)
    } finally {
      setImageLoading(false)
    }
  }

  const isActive = avatarStatus !== 'idle'
  const isSpeaking = avatarStatus === 'speaking'

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.statusRow}>
          <StatusBar status={status} latencyMs={latencyMs} />
        </div>
        <button
          className={styles.settingsBtn}
          onClick={() => setSettingsOpen(true)}
          aria-label="Open settings"
          title="System Configuration"
        >
          ⚙ CONFIG
        </button>
      </div>

      {/* Main grid */}
      <div className={styles.grid}>
        {/* Chat — large left column */}
        <div className={styles.chatCell}>
          <ChatPanel
            messages={messages}
            loading={chatLoading}
            onSend={handleChatSend}
          />
        </div>

        {/* Right column */}
        <div className={styles.sideColumn}>
          {/* Avatar + system label */}
          <div className={styles.avatarSection}>
            <GlitchText text="A.I.M.A.D" as="h2" className={styles.avatarLabel} variant="cyan" />
            <AssistantAvatar
              active={isActive}
              speaking={isSpeaking}
              status={avatarStatus}
            />
          </div>

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

          {/* Activity log */}
          <ActivityLog entries={logEntries} />

          <ToolsPlaceholder />
        </div>
      </div>

      {/* Settings overlay */}
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onChange={() => addLog('system', 'Configuration updated')}
      />

      {/* Toast notifications */}
      <NotificationToast toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}
