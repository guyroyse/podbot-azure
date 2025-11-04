// Types
export enum ChatRole {
  SUMMARY = 'summary',
  USER = 'user',
  PODBOT = 'podbot'
}

export type ChatMessage = {
  role: ChatRole
  content: string
}

export type SessionHistory = ChatMessage[]

export type ChatRequest = {
  message: string
}

export type ChatResponse = {
  response: string
}

// API Functions
export async function fetchSessionHistory(username: string): Promise<SessionHistory> {
  const url = buildUrl(username)
  const options = buildOptions('GET')
  const response = await fetch(url, options)
  validateResponse(response)
  return (await response.json()) as SessionHistory
}

export async function sendMessage(username: string, message: string): Promise<ChatResponse> {
  const url = buildUrl(username)
  const options = buildOptions('POST', { message })
  const response = await fetch(url, options)
  validateResponse(response)
  return (await response.json()) as ChatResponse
}

export async function clearSession(username: string): Promise<void> {
  const url = buildUrl(username)
  const options = buildOptions('DELETE')
  const response = await fetch(url, options)
  validateResponse(response)
}

function buildUrl(username: string): string {
  return `/api/sessions/${username}`
}

function buildOptions(method: string, body?: ChatRequest): RequestInit {
  const options: RequestInit = {}
  options.method = method
  options.headers = { 'Content-Type': 'application/json' }
  if (body) options.body = JSON.stringify(body)
  return options
}

function validateResponse(response: Response): void {
  if (!response.ok) throw new Error(`API request failed (${response.status}): ${response.statusText}`)
}
