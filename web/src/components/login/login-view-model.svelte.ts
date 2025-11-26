import AppRouter from '@src/app-router.svelte'
import AppState from '@state/app-state.svelte'
import ConversationState from '@state/conversation-state.svelte'
import UserState from '@state/user-state.svelte'
import SessionState from '@state/session-state.svelte'

export default class LoginViewModel {
  static #instance: LoginViewModel

  // Local UI state
  #username = $state('')
  #password = $state('')
  #hasLoginError = $state(false)

  #appRouter: AppRouter
  #appState: AppState
  #conversationState: ConversationState
  #sessionState: SessionState
  #userState: UserState

  private constructor() {
    this.#appRouter = AppRouter.instance
    this.#appState = AppState.instance
    this.#conversationState = ConversationState.instance
    this.#sessionState = SessionState.instance
    this.#userState = UserState.instance
  }

  static get instance(): LoginViewModel {
    return this.#instance ?? (this.#instance = new LoginViewModel())
  }

  get username(): string {
    return this.#username
  }

  set username(value: string) {
    this.#username = value
  }

  get password(): string {
    return this.#password
  }

  set password(value: string) {
    this.#password = value
  }

  get hasLoginError(): boolean {
    return this.#hasLoginError
  }

  get trimmedUsername(): string {
    return this.#username.trim()
  }

  get canLogin(): boolean {
    return !!(this.trimmedUsername && this.#password)
  }

  // Actions
  handleLogin = async (event: Event): Promise<void> => {
    event.preventDefault()

    this.#appState.showOverlay()
    try {
      const success = await this.#userState.login(this.trimmedUsername, this.#password)
      if (success) {
        await this.#handleLoginSuccess()
      } else {
        this.#handleLoginFailure()
      }
    } finally {
      this.#appState.hideOverlay()
    }
  }

  #handleLoginSuccess = async (): Promise<void> => {
    this.#hasLoginError = false

    // Load or create sessions for the user
    const username = this.#userState.username!
    await this.#sessionState.loadSessions(username)
    if (!this.#sessionState.hasSessions) await this.#sessionState.createSession(username)

    // load the conversation history for the user and session
    const sessionId = this.#sessionState.currentSessionId!
    await this.#conversationState.loadConversation(username, sessionId)

    // Clear form
    this.#username = ''
    this.#password = ''

    // Navigate to chat
    this.#appRouter.routeToChat()
  }

  #handleLoginFailure(): void {
    this.#hasLoginError = true

    // Clear password
    this.#password = ''
  }
}
