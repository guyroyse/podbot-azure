export type ChatMessage = {
  role: 'user' | 'podbot'
  content: string
}

export default class ChatState {
  #messages = $state<ChatMessage[]>([])
  #isLoading = $state(false)
  #isSending = $state(false)

  get messages(): ChatMessage[] {
    return this.#messages
  }

  get messageCount(): number {
    return this.#messages.length
  }

  get isLoading(): boolean {
    return this.#isLoading
  }

  get isSending(): boolean {
    return this.#isSending
  }

  get isBusy(): boolean {
    return this.#isLoading || this.#isSending
  }

  async loadMessages(sessionId: string, username: string): Promise<void> {
    this.#isLoading = true
    try {
      // TODO: Replace with actual API call
      await this.#simulateDelay(500)
      this.#messages = [
        { role: 'user', content: 'Can you recommend some history podcasts?' },
        {
          role: 'podbot',
          content:
            "I would recommend **Hardcore History** by Dan Carlin. It's an excellent deep dive into various historical topics."
        },
        { role: 'user', content: 'What about something shorter?' },
        {
          role: 'podbot',
          content: 'For shorter episodes, try **History in 10 Minutes** or **Stuff You Missed in History Class**.'
        }
      ]
    } catch (error) {
      console.error('Failed to load messages:', error)
      this.#messages = []
    } finally {
      this.#isLoading = false
    }
  }

  async sendMessage(sessionId: string, username: string, content: string): Promise<void> {
    this.#isSending = true
    try {
      // Add user message immediately
      this.#messages.push({ role: 'user', content })

      // TODO: Replace with actual API call
      await this.#simulateDelay(1000)

      // Add stubbed bot response
      this.#messages.push({
        role: 'podbot',
        content: `Thanks for your message: "${content}". This is a stubbed response.`
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.#messages.push({ role: 'podbot', content: `Error: ${errorMessage}` })
    } finally {
      this.#isSending = false
    }
  }

  clear(): void {
    this.#messages = []
  }

  #simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
