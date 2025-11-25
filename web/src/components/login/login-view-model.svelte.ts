import AppRouter from '@src/app-router.svelte'
import AppState from '@state/app-state.svelte'
import UserState from '@state/user-state.svelte'

export default class LoginViewModel {
  static #instance: LoginViewModel

  // Local UI state
  #username = $state('')
  #password = $state('')
  #hasLoginError = $state(false)

  #appRouter: AppRouter
  #appState: AppState
  #userState: UserState

  private constructor() {
    this.#userState = UserState.instance
    this.#appState = AppState.instance
    this.#appRouter = AppRouter.instance
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
    const success = await this.#userState.login(this.trimmedUsername, this.#password)

    if (success) {
      this.#hasLoginError = false
      this.#username = ''
      this.#password = ''

      this.#appRouter.routeToChat()
    } else {
      this.#hasLoginError = true
      this.#password = ''
    }

    this.#appState.hideOverlay()
  }
}
