export type ChatRequest = {
  message: string
}

export type ChatResponse = {
  response: string
}

export type HistoryResponse = Array<{
  role: string
  content: string
}>

export class ChatApi {
  async fetchSessionHistory(username: string): Promise<HistoryResponse> {
    const url = this.#buildUrl(username)
    const options = this.#buildOptions('GET')
    const response = await fetch(url, options)
    this.#validateResponse(response)
    return (await response.json()) as HistoryResponse
  }

  async sendMessage(username: string, request: ChatRequest): Promise<ChatResponse> {
    const url = this.#buildUrl(username)
    const options = this.#buildOptions('POST', request)
    const response = await fetch(url, options)
    this.#validateResponse(response)
    return (await response.json()) as ChatResponse
  }

  async clearSession(username: string): Promise<void> {
    const url = this.#buildUrl(username)
    const options = this.#buildOptions('DELETE')
    const response = await fetch(url, options)
    this.#validateResponse(response)
  }

  #buildUrl(username: string): string {
    return `/api/sessions/${username}`
  }

  #buildOptions(method: string, body?: ChatRequest): RequestInit {
    const options: RequestInit = {}
    options.method = method
    options.headers = { 'Content-Type': 'application/json' }
    if (body) options.body = JSON.stringify(body)
    return options
  }

  #validateResponse(response: Response): void {
    if (!response.ok) throw new Error(`API request failed (${response.status}): ${response.statusText}`)
  }
}
