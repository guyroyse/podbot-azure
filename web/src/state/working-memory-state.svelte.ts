export type WorkingMemoryMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type WorkingMemory = {
  context: string
  messages: WorkingMemoryMessage[]
}

export default class WorkingMemoryState {
  static #instance: WorkingMemoryState

  #workingMemory = $state<WorkingMemory>({ context: '', messages: [] })
  #isLoading = $state(false)

  private constructor() {}

  static get instance() {
    return this.#instance ?? (this.#instance = new WorkingMemoryState())
  }

  get context(): string {
    return this.#workingMemory.context
  }

  get hasContext(): boolean {
    return this.#workingMemory.context.length > 0
  }

  get messages(): WorkingMemoryMessage[] {
    return this.#workingMemory.messages
  }

  get messageCount(): number {
    return this.#workingMemory.messages.length
  }

  get isLoading(): boolean {
    return this.#isLoading
  }

  async loadWorkingMemory(sessionId: string, username: string): Promise<void> {
    this.#isLoading = true
    try {
      // TODO: Replace with actual API call
      await this.#simulateDelay(500)
      this.#workingMemory = {
        context:
          "The user is interested in history podcasts, particularly ancient Rome and World War II. They prefer podcasts under 45 minutes and enjoy narrative storytelling styles. Previously recommended: Dan Carlin's Hardcore History, The History of Rome by Mike Duncan.",
        messages: [
          { role: 'user', content: 'What about something on the Byzantine Empire?' },
          {
            role: 'assistant',
            content:
              "For Byzantine history, I'd highly recommend 'The History of Byzantium' by Robin Pierson. It's a spiritual successor to Mike Duncan's 'The History of Rome' and picks up right where that series ends. Each episode is around 20-30 minutes, fitting your preference for shorter episodes."
          },
          { role: 'user', content: 'That sounds perfect! Any others?' },
          {
            role: 'assistant',
            content:
              "You might also enjoy '12 Byzantine Rulers' by Lars Brownworth - it's a classic that covers 12 pivotal emperors. It's shorter and more focused if you want a quick introduction before diving into the longer series."
          }
        ]
      }
    } catch (error) {
      console.error('Failed to load working memory:', error)
      this.#workingMemory = { context: '', messages: [] }
    } finally {
      this.#isLoading = false
    }
  }

  clear(): void {
    this.#workingMemory = { context: '', messages: [] }
  }

  #simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
