import { ChatApi, type ChatRequest, type ChatResponse, type HistoryResponse } from './chat-api'
import { ChatRole, type ChatMessage, type SessionHistory, type Username } from '../types'

export class ChatModel {
  #api: ChatApi

  constructor() {
    this.#api = new ChatApi()
  }

  async fetchSessionHistory(username: Username): Promise<SessionHistory> {
    const historyResponse: HistoryResponse = await this.#api.fetchSessionHistory(username)
    return historyResponse.map(item => ({
      role: item.role as ChatRole,
      content: item.content
    }))
  }

  async sendMessage(username: Username, message: ChatMessage): Promise<ChatMessage> {
    const chatRequest: ChatRequest = { message: message.content }
    const chatResponse: ChatResponse = await this.#api.sendMessage(username, chatRequest)
    return { role: ChatRole.PODBOT, content: chatResponse.response }
  }

  async clearSession(username: Username): Promise<void> {
    await this.#api.clearSession(username)
  }
}
