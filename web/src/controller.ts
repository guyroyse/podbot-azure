import { DisplayView } from './view/display-view'
import { SessionView } from './view/session-view'
import { SenderView } from './view/sender-view'
import { ChatModel } from './model/chat-model'
import { ChatRole, type ChatMessage, type SessionHistory, type Username } from './types'

export class AppController {
  #displayView: DisplayView
  #sessionView: SessionView
  #senderView: SenderView
  #chatModel: ChatModel

  constructor() {
    this.#displayView = new DisplayView()
    this.#sessionView = new SessionView()
    this.#senderView = new SenderView()
    this.#chatModel = new ChatModel()
  }

  start(): void {
    this.#sessionView.addEventListener('load', () => this.#onSessionLoad())
    this.#sessionView.addEventListener('clear', () => this.#onSessionClear())
    this.#sessionView.addEventListener('enabled', () => this.#onSessionEnabled())
    this.#sessionView.addEventListener('disabled', () => this.#onSessionDisabled())
    this.#senderView.addEventListener('send', () => this.#onMessageSend())

    this.#setInitialFocus()
  }

  async #onSessionLoad(): Promise<void> {
    const username: Username = this.#sessionView.username

    this.#disableUI()

    try {
      const messages: SessionHistory = await this.#chatModel.fetchSessionHistory(username)
      this.#displayView.clearHistory()
      messages.forEach(message => this.#displayView.displayMessage(message))
    } catch (error) {
      this.#displayView.displayError(error as Error)
    }

    this.#enableUI()
  }

  async #onSessionClear(): Promise<void> {
    const username: Username = this.#sessionView.username

    const confirmed = confirm(`Are you sure you want to clear the session for ${username}?`)
    if (!confirmed) return

    this.#disableUI()

    try {
      await this.#chatModel.clearSession(username)
      this.#displayView.clearHistory()
    } catch (error) {
      this.#displayView.displayError(error as Error)
    }

    this.#enableUI()
  }

  #onSessionEnabled(): void {
    this.#senderView.disabled = false
  }

  #onSessionDisabled(): void {
    this.#senderView.disabled = true
  }

  async #onMessageSend(): Promise<void> {
    const message: string = this.#senderView.message
    const username: Username = this.#sessionView.username
    const userMessage: ChatMessage = { role: ChatRole.USER, content: message }

    this.#senderView.clearInput()
    this.#disableUI()

    this.#displayView.displayMessage(userMessage)

    try {
      const botMessage: ChatMessage = await this.#chatModel.sendMessage(username, userMessage)
      this.#displayView.displayMessage(botMessage)
    } catch (error) {
      this.#displayView.displayError(error as Error)
    }

    this.#enableUI()
  }

  #setInitialFocus(): void {
    if (this.#sessionView.username) {
      this.#senderView.focus()
    } else {
      this.#sessionView.focus()
    }
  }

  #disableUI(): void {
    this.#sessionView.disabled = true
    this.#senderView.disabled = true
    this.#displayView.loading = true
  }

  #enableUI(): void {
    this.#displayView.loading = false
    this.#sessionView.disabled = false
    this.#senderView.disabled = false
  }
}
