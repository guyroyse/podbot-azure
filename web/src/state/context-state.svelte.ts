export type ContextMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type Context = {
  context: string
  messages: ContextMessage[]
}

export default class ContextState {
  #context = $state<Context>({ context: '', messages: [] })
  #isLoading = $state(false)

  get summary(): string {
    return this.#context.context
  }

  get hasSummary(): boolean {
    return this.#context.context.length > 0
  }

  get messages(): ContextMessage[] {
    return this.#context.messages
  }

  get messageCount(): number {
    return this.#context.messages.length
  }

  get isLoading(): boolean {
    return this.#isLoading
  }

  async loadContext(sessionId: string, username: string): Promise<void> {
    this.#isLoading = true
    try {
      // TODO: Replace with actual API call
      await this.#simulateDelay(500)
      this.#context = {
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
      console.error('Failed to load context:', error)
      this.#context = { context: '', messages: [] }
    } finally {
      this.#isLoading = false
    }
  }

  clear(): void {
    this.#context = { context: '', messages: [] }
  }

  #simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
