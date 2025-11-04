export class SessionView extends EventTarget {
  private usernameInput: HTMLInputElement
  private loadButton: HTMLButtonElement
  private clearButton: HTMLButtonElement

  constructor() {
    super()
    this.usernameInput = document.querySelector('#username') as HTMLInputElement
    this.loadButton = document.querySelector('#load-session') as HTMLButtonElement
    this.clearButton = document.querySelector('#clear-session') as HTMLButtonElement

    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    this.loadButton.addEventListener('click', () => {
      const username = this.usernameInput.value.trim()
      this.dispatchEvent(new CustomEvent('load', { detail: { username } }))
    })

    this.clearButton.addEventListener('click', () => {
      const username = this.usernameInput.value.trim()
      this.dispatchEvent(new CustomEvent('clear', { detail: { username } }))
    })

    this.usernameInput.addEventListener('input', () => {
      this.dispatchEvent(new Event('usernamechange'))
    })
  }

  getUsername(): string {
    return this.usernameInput.value.trim()
  }

  setLoadingState(loading: boolean): void {
    this.loadButton.disabled = loading
    this.clearButton.disabled = loading
  }

  focus(): void {
    this.usernameInput.focus()
  }
}
