import AppState from '@state/app-state.svelte'
import ConversationState from '@state/conversation-state.svelte'
import SessionState from '@state/session-state.svelte'
import UserState from '@state/user-state.svelte'
import type { Session } from '@state/session-state.svelte'

export default class SessionViewModel {
  static #instance: SessionViewModel

  #appState: AppState
  #conversationState: ConversationState
  #sessionState: SessionState
  #userState: UserState

  private constructor() {
    this.#appState = AppState.instance
    this.#conversationState = ConversationState.instance
    this.#sessionState = SessionState.instance
    this.#userState = UserState.instance
  }

  static get instance(): SessionViewModel {
    return this.#instance ?? (this.#instance = new SessionViewModel())
  }

  get sessions(): Session[] {
    return this.#sessionState.sessions
  }

  get currentSessionId(): string | null {
    return this.#sessionState.currentSessionId
  }

  get hasSessions(): boolean {
    return this.#sessionState.hasSessions
  }

  selectSession = async (id: string) => {
    this.#appState.showOverlay()
    try {
      // select the session
      this.#sessionState.selectSession(id)

      // load the conversation history for the user and session
      const username = this.#userState.username!
      await this.#conversationState.loadConversation(username, id)
    } finally {
      this.#appState.hideOverlay()
    }
  }

  createSession = async (): Promise<void> => {
    const username = this.#userState.username
    if (!username) return

    await this.#sessionState.createSession(username)
  }
}
