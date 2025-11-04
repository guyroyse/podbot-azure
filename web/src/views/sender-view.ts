export class SenderView extends EventTarget {
  private messageInput: HTMLInputElement
  private sendButton: HTMLButtonElement
  private messageForm: HTMLFormElement

  constructor() {
    super()
    this.messageInput = document.querySelector('#message-input') as HTMLInputElement
    this.sendButton = document.querySelector('#send-message') as HTMLButtonElement
    this.messageForm = document.querySelector('.input-group') as HTMLFormElement

    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    this.sendButton.addEventListener('click', () => {
      this.handleSend()
    })

    this.messageForm.addEventListener('submit', (event) => {
      event.preventDefault()
      this.handleSend()
    })

    this.messageInput.addEventListener('input', () => {
      this.dispatchEvent(new Event('inputchange'))
    })

    this.messageInput.addEventListener('keypress', (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        this.handleSend()
      }
    })
  }

  private handleSend(): void {
    if (this.sendButton.disabled) return

    const message = this.messageInput.value.trim()
    if (message) {
      this.dispatchEvent(new CustomEvent('send', { detail: { message } }))
    }
  }

  clearInput(): void {
    this.messageInput.value = ''
  }

  setLoading(loading: boolean): void {
    this.sendButton.disabled = loading

    if (loading) {
      this.sendButton.classList.add('loading')
    } else {
      this.sendButton.classList.remove('loading')
    }
  }

  isLoading(): boolean {
    return this.sendButton.classList.contains('loading')
  }

  updateButtonState(hasUsername: boolean, hasMessage: boolean): void {
    const isLoading = this.isLoading()
    this.sendButton.disabled = !hasUsername || isLoading || !hasMessage
  }

  focus(): void {
    this.messageInput.focus()
  }

  hasMessage(): boolean {
    return this.messageInput.value.trim().length > 0
  }
}
