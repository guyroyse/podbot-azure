import * as authService from '@services/auth-service'

export default class UserState {
  static #instance: UserState

  #username = $state<string | null>(null)

  private constructor() {}

  static get instance(): UserState {
    return this.#instance ?? (this.#instance = new UserState())
  }

  get username(): string | null {
    return this.#username
  }

  get isLoggedIn(): boolean {
    return !!this.#username
  }

  async login(username: string, password: string): Promise<boolean> {
    const success = await authService.login(username, password)

    if (success) {
      this.#username = username
    }

    return success
  }

  logout(): void {
    this.#username = null
  }
}
