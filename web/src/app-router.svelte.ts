export enum Route {
  Login = 'login',
  Chat = 'chat',
  Context = 'context',
  Memory = 'memory'
}

export default class AppRouter {
  static #instance: AppRouter
  #currentRoute = $state<Route>(Route.Login)

  private constructor() {}

  static get instance() {
    return this.#instance ?? (this.#instance = new AppRouter())
  }

  get currentRoute(): Route {
    return this.#currentRoute
  }

  routeToLogin() {
    this.#currentRoute = Route.Login
  }

  routeToChat() {
    this.#currentRoute = Route.Chat
  }

  routeToContext() {
    this.#currentRoute = Route.Context
  }

  routeToMemory() {
    this.#currentRoute = Route.Memory
  }
}
