import UserState from '@state/user-state.svelte'
import SessionState from '@state/session-state.svelte'
import ConversationState from '@state/conversation-state.svelte'
import AppState from '@state/app-state.svelte'
import type { ContextMessage, Memory } from '@state/conversation-state.svelte'

export default class ContextViewModel {
  static #instance: ContextViewModel

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

  static get instance(): ContextViewModel {
    return this.#instance ?? (this.#instance = new ContextViewModel())
  }

  get summary(): string {
    return this.#conversationState.summary
  }

  get hasSummary(): boolean {
    return this.#conversationState.hasSummary
  }

  get recentMessages(): ContextMessage[] {
    return this.#conversationState.recentMessages
  }

  get hasRecentMessages(): boolean {
    return this.#conversationState.hasRecentMessages
  }

  get recentMessagesCount(): number {
    return this.#conversationState.recentMessagesCount
  }

  get relevantMemories(): Memory[] {
    return this.#conversationState.relevantMemories
  }

  get hasRelevantMemories(): boolean {
    return this.#conversationState.hasRelevantMemories
  }

  get relevantMemoriesCount(): number {
    return this.#conversationState.relevantMemoriesCount
  }

  async loadContext(): Promise<void> {
    const sessionId = this.#sessionState.currentSessionId
    const username = this.#userState.username
    if (!sessionId || !username) return

    this.#appState.showOverlay()
    try {
      await this.#conversationState.loadConversation(username, sessionId)
    } finally {
      this.#appState.hideOverlay()
    }
  }
}
