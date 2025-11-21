type WorkingMemoryMessage = {
  role: 'user' | 'assistant'
  content: string
}

type WorkingMemory = {
  context: string
  messages: WorkingMemoryMessage[]
}

export default class WorkingMemoryViewModel {
  #workingMemory = $state<WorkingMemory>({ context: '', messages: [] })
  #isLoading = $state(false)

  get isLoading() {
    return this.#isLoading
  }

  get context() {
    return this.#workingMemory.context
  }

  get hasContext() {
    return this.#workingMemory.context.length > 0
  }

  get messages() {
    return this.#workingMemory.messages
  }

  get messageCount() {
    return this.#workingMemory.messages.length
  }

  async loadWorkingMemory() {
    this.#isLoading = true
    try {
      // TODO: Replace with actual API call
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
}
