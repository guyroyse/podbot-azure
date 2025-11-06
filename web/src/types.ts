export type Username = string

export enum ChatRole {
  SUMMARY = 'summary',
  USER = 'user',
  PODBOT = 'podbot'
}

export type ChatMessage = {
  role: ChatRole
  content: string
}

export type SessionHistory = ChatMessage[]
