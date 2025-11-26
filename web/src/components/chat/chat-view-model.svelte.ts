import AppState from '@state/app-state.svelte'
import ConversationState from '@state/conversation-state.svelte'
import SessionState from '@state/session-state.svelte'
import UserState from '@state/user-state.svelte'
import type { ChatMessage } from '@state/conversation-state.svelte'

export default class ChatViewModel {
  static #instance: ChatViewModel

  #appState: AppState
  #conversationState: ConversationState
  #sessionState: SessionState
  #userState: UserState

  #currentMessage = $state('')

  private constructor() {
    this.#appState = AppState.instance
    this.#conversationState = ConversationState.instance
    this.#sessionState = SessionState.instance
    this.#userState = UserState.instance
  }

  static get instance(): ChatViewModel {
    return this.#instance ?? (this.#instance = new ChatViewModel())
  }

  get currentMessage(): string {
    return this.#currentMessage
  }

  set currentMessage(value: string) {
    this.#currentMessage = value
  }

  get hasCurrentMessage(): boolean {
    return this.#currentMessage.trim().length > 0
  }

  get username(): string | null {
    return this.#userState.username
  }

  get messages(): ChatMessage[] {
    return this.#conversationState.chatHistory
  }

  get messageCount(): number {
    return this.#conversationState.chatHistory.length
  }

  sendMessage = async (): Promise<void> => {
    const message = this.#currentMessage.trim()

    const sessionId = this.#sessionState.currentSessionId
    const username = this.#userState.username
    if (!sessionId || !username) return

    this.#currentMessage = ''

    this.#appState.showOverlay()
    try {
      await this.#conversationState.sendMessage(username, sessionId, message)
    } finally {
      this.#appState.hideOverlay()
    }
  }
}
