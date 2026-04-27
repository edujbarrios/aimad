import { useEffect, useRef, useState } from 'react'
import { checkHealth } from '@/services/api'

type BackendStatus = 'online' | 'offline' | 'connecting'

export function useBackendStatus(intervalMs = 8000) {
  const [status, setStatus] = useState<BackendStatus>('connecting')
  const [latencyMs, setLatencyMs] = useState<number | undefined>()
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  async function ping() {
    const start = performance.now()
    try {
      await checkHealth()
      setLatencyMs(Math.round(performance.now() - start))
      setStatus('online')
    } catch {
      setStatus('offline')
      setLatencyMs(undefined)
    }
  }

  useEffect(() => {
    ping()
    timerRef.current = setInterval(ping, intervalMs)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [intervalMs])

  return { status, latencyMs }
}
