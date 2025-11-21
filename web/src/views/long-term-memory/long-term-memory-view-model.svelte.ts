type Memory = {
  id: string
  content: string
  created: string
}

export default class LongTermMemoryViewModel {
  #memories = $state<Memory[]>([])
  #isLoading = $state(false)

  get isLoading() {
    return this.#isLoading
  }

  get memories() {
    return this.#memories
  }

  get memoryCount() {
    return this.#memories.length
  }

  get hasMemories() {
    return this.#memories.length > 0
  }

  async loadMemories() {
    this.#isLoading = true
    try {
      // TODO: Replace with actual API call
      this.#memories = [
        // {
        //   id: '1',
        //   content: 'Prefers history podcasts, especially ancient Rome and World War II',
        //   created: 'Nov 15, 2024'
        // },
        // {
        //   id: '2',
        //   content: 'Likes episodes under 45 minutes',
        //   created: 'Nov 15, 2024'
        // },
        // {
        //   id: '3',
        //   content: 'Enjoys narrative storytelling style over interview format',
        //   created: 'Nov 16, 2024'
        // },
        // {
        //   id: '4',
        //   content: "Has listened to and enjoyed Dan Carlin's Hardcore History",
        //   created: 'Nov 17, 2024'
        // },
        // {
        //   id: '5',
        //   content: 'Completed The History of Rome podcast by Mike Duncan',
        //   created: 'Nov 18, 2024'
        // }
      ]
    } catch (error) {
      console.error('Failed to load memories:', error)
      this.#memories = []
    } finally {
      this.#isLoading = false
    }
  }
}
