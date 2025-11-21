export default class UserState {
  static #instance: UserState

  #username = $state<string | null>(null)

  private constructor() {}

  static get instance() {
    return this.#instance ?? (this.#instance = new UserState())
  }

  get username(): string | null {
    return this.#username
  }

  get isLoggedIn(): boolean {
    return this.#username !== null
  }

  login(username: string) {
    this.#username = username
  }

  logout() {
    this.#username = null
  }
}
