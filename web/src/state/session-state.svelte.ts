import { ulid } from 'ulid'

export type Session = {
  id: string
  lastActive: Date
}

export default class SessionState {
  #sessions = $state<Session[]>([])
  #currentSessionId = $state<string | null>(null)
  #isLoading = $state(false)

  get sessions(): Session[] {
    return this.#sessions
  }

  get currentSessionId(): string | null {
    return this.#currentSessionId
  }

  get currentSession(): Session | undefined {
    return this.#sessions.find(s => s.id === this.#currentSessionId)
  }

  get isLoading(): boolean {
    return this.#isLoading
  }

  get isBusy(): boolean {
    return this.#isLoading
  }

  get hasSessions(): boolean {
    return this.#sessions.length > 0
  }

  async loadSessions(username: string): Promise<void> {
    this.#isLoading = true
    try {
      // TODO: Replace with actual API call
      await this.#simulateDelay(500)
      this.#sessions = [
        { id: ulid(), lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000) },
        { id: ulid(), lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        { id: ulid(), lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
      ]
      // Auto-select most recent session
      if (this.#sessions.length > 0 && !this.#currentSessionId) {
        this.#currentSessionId = this.#sessions[0].id
      }
    } catch (error) {
      console.error('Failed to load sessions:', error)
      this.#sessions = []
    } finally {
      this.#isLoading = false
    }
  }

  async selectSession(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 250))
    const session = this.#sessions.find(s => s.id === id)
    if (session) {
      this.#currentSessionId = id
    }
  }

  async createSession(name?: string): Promise<string> {
    this.#isLoading = true
    try {
      // TODO: Replace with actual API call
      await this.#simulateDelay(500)
      const id = ulid()
      const session: Session = {
        id,
        lastActive: new Date()
      }
      this.#sessions.unshift(session)
      this.#currentSessionId = id
      return id
    } finally {
      this.#isLoading = false
    }
  }

  clear(): void {
    this.#sessions = []
    this.#currentSessionId = null
  }

  #simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
