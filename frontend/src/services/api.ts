const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? 'Request failed')
  }
  return res.json() as Promise<T>
}

// ── Health ────────────────────────────────────────────────────────────────

export interface HealthResponse {
  status: string
  version: string
  message: string
}

export function checkHealth(): Promise<HealthResponse> {
  return request<HealthResponse>('/health')
}

// ── LLM ──────────────────────────────────────────────────────────────────

export interface PromptResponse {
  content: string
  model: string
  provider: string
  usage?: Record<string, number> | null
}

export function sendPrompt(prompt: string): Promise<PromptResponse> {
  return request<PromptResponse>('/api/llm/prompt', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  })
}

// ── Voice ─────────────────────────────────────────────────────────────────

export interface VoiceCommandResponse {
  command: string
  result: string
  spoken: boolean
}

export function sendVoiceCommand(transcript: string): Promise<VoiceCommandResponse> {
  return request<VoiceCommandResponse>('/api/voice/command', {
    method: 'POST',
    body: JSON.stringify({ transcript }),
  })
}

// ── Image ─────────────────────────────────────────────────────────────────

export interface ImageAnalysisResponse {
  insight: string
  model: string
  provider: string
  spoken: boolean
}

export async function analyzeImage(
  file: File,
  prompt: string,
  speak = false,
): Promise<ImageAnalysisResponse> {
  const form = new FormData()
  form.append('file', file)
  form.append('prompt', prompt)
  form.append('speak', String(speak))

  const res = await fetch(`${BASE}/api/image/analyze`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? 'Image analysis failed')
  }
  return res.json() as Promise<ImageAnalysisResponse>
}
