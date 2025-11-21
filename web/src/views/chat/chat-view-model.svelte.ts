type ChatMessage = {
  role: 'user' | 'podbot'
  content: string
}

export default class ChatViewModel {
  #messages = $state<ChatMessage[]>([])
  #currentMessage = $state('')
  #isLoadingHistory = $state(false)
  #isProcessingMessage = $state(false)

  get isLoadingHistory() {
    return this.#isLoadingHistory
  }

  get isProcessingMessage() {
    return this.#isProcessingMessage
  }

  get isLoading() {
    return this.#isLoadingHistory || this.#isProcessingMessage
  }

  get currentMessage() {
    return this.#currentMessage
  }

  set currentMessage(message: string) {
    this.#currentMessage = message
  }

  get messages() {
    return this.#messages
  }

  get messageCount() {
    return this.#messages.length
  }

  async sendMessage() {
    if (this.canSend()) {
      const message = this.trimmedMessage()
      this.clearInput()
      this.#isProcessingMessage = true

      try {
        await this.processMessage(message)
      } catch (error) {
        this.displayError(error)
      } finally {
        this.#isProcessingMessage = false
      }
    }
  }

  async loadChatHistory() {
    this.#isLoadingHistory = true
    try {
      // TODO: Replace with actual API call
      this.#messages = [
        { role: 'user', content: 'Can you recommend some history podcasts?' },
        { role: 'podbot', content: 'I would recommend **Hardcore History** by Dan Carlin. It\'s an excellent deep dive into various historical topics.' },
        { role: 'user', content: 'What about something shorter?' },
        { role: 'podbot', content: 'For shorter episodes, try **History in 10 Minutes** or **Stuff You Missed in History Class**.' }
      ]
    } catch (error) {
      console.error('Failed to load chat history:', error)
      this.#messages = []
    } finally {
      this.#isLoadingHistory = false
    }
  }

  private async processMessage(message: string) {
    // Add user message
    this.#messages.push({ role: 'user', content: message })

    // TODO: Replace with actual API call
    await this.simulateDelay(1000)

    // Add stubbed bot response
    this.#messages.push({
      role: 'podbot',
      content: `Thanks for your message: "${message}". This is a stubbed response.`
    })
  }

  private displayError(error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    this.#messages.push({ role: 'podbot', content: `Error: ${errorMessage}` })
  }

  private canSend() {
    return !this.isLoading && this.trimmedMessage().length > 0
  }

  private trimmedMessage() {
    return this.#currentMessage.trim()
  }

  private clearInput() {
    this.#currentMessage = ''
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
