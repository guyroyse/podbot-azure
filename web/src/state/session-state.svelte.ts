import { ulid } from 'ulid'

export type Session = {
  id: string
  name: string
  lastActive: Date
}

export default class SessionState {
  static #instance: SessionState

  #sessions = $state<Session[]>([])
  #currentSessionId = $state<string | null>(null)
  #isLoading = $state(false)

  private constructor() {}

  static get instance() {
    return this.#instance ?? (this.#instance = new SessionState())
  }

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

  get hasSessions(): boolean {
    return this.#sessions.length > 0
  }

  async loadSessions(username: string): Promise<void> {
    this.#isLoading = true
    try {
      // TODO: Replace with actual API call
      await this.#simulateDelay(500)
      this.#sessions = [
        { id: '01JFG8X9ABCD1234', name: 'History Podcasts', lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000) },
        { id: '01JFG7Y8WXYZ5678', name: 'True Crime Recs', lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        { id: '01JFG6Z7MNOP9012', name: 'Tech & Science', lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
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

  selectSession(id: string): void {
    const session = this.#sessions.find(s => s.id === id)
    if (session) {
      this.#currentSessionId = id
    }
  }

  createSession(name?: string): string {
    const id = ulid()
    const session: Session = {
      id,
      name: name ?? `Session ${this.#sessions.length + 1}`,
      lastActive: new Date()
    }
    this.#sessions.unshift(session)
    this.#currentSessionId = id
    return id
  }

  clear(): void {
    this.#sessions = []
    this.#currentSessionId = null
  }

  #simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
