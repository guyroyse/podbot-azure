import { marked } from 'marked'
import { type ChatMessage, ChatRole } from '../model'

export class DisplayView {
  private messageHistory: HTMLElement
  private mainContainer: HTMLElement
  private usernameInput: HTMLInputElement

  constructor() {
    this.messageHistory = document.querySelector('#message-history') as HTMLElement
    this.mainContainer = document.querySelector('main') as HTMLElement
    this.usernameInput = document.querySelector('#username') as HTMLInputElement
  }

  displayMessage(message: ChatMessage): void {
    const entity = document.createElement('span')
    entity.className = 'username'

    const content = document.createElement('div')

    const item = document.createElement('li')
    item.classList.add('message')
    item.appendChild(entity)
    item.appendChild(content)

    switch (message.role) {
      case ChatRole.USER:
        item.classList.add('user-message')
        entity.textContent = `${this.usernameInput.value.trim() ?? 'you'}> `
        content.textContent = `${message.content}`
        break
      case ChatRole.PODBOT:
        item.classList.add('bot-message')
        entity.textContent = 'PodBot> '
        content.innerHTML = marked.parse(message.content) as string
        break
      case ChatRole.SUMMARY:
        item.classList.add('summary-message')
        entity.textContent = 'Context> '
        content.textContent = message.content
        break
    }

    this.messageHistory.appendChild(item)
    this.scrollToBottom()
  }

  showError(message: string): void {
    const item = document.createElement('li')
    item.className = 'system-message'
    item.textContent = `Error: ${message}`
    this.messageHistory.appendChild(item)
    this.scrollToBottom()
  }

  clear(): void {
    this.messageHistory.innerHTML = ''
  }

  private scrollToBottom(): void {
    this.mainContainer.scrollTop = this.mainContainer.scrollHeight
  }
}
