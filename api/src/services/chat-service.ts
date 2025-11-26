import type { InvocationContext } from '@azure/functions'
import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from '@langchain/core/messages'

import type { AmsMessage } from './memory-server.js'
import { config } from '@/config.js'
import { generateResponse } from './agent-adapter.js'
import { readWorkingMemory, replaceWorkingMemory, AmsRole } from './memory-server.js'
import type { Session, ChatMessage } from './redis-adapter.js'
import { listUserSessions, createUserSession, readChat, appendToChat } from './redis-adapter.js'

// ========== Types ==========

export type { Session, ChatMessage }

export type ContextMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type Memory = {
  id: string
  content: string
  createdAt: string
}

export type Context = {
  summary: string
  recentMessages: ContextMessage[]
  relevantMemories: Memory[]
}

export type ChatWithContext = {
  chatHistory: ChatMessage[]
  context: Context
}

// ========== Session Management ==========

/**
 * List all sessions for a user
 */
export async function fetchSessions(
  username: string,
  invocationContext: InvocationContext
): Promise<Session[]> {
  return await listUserSessions('podbot', username, invocationContext)
}

/**
 * Create a new session for a user
 */
export async function createNewSession(
  username: string,
  invocationContext: InvocationContext
): Promise<Session> {
  return await createUserSession('podbot', username, invocationContext)
}

// ========== Chat + Context (Combined) ==========

/**
 * Fetch chat history from Redis and context from AMS
 */
export async function fetchSession(
  username: string,
  sessionId: string,
  invocationContext: InvocationContext
): Promise<ChatWithContext> {
  try {
    // Get chat history from Redis Stream
    const chatHistory = await readChat('podbot', username, sessionId, invocationContext)
    invocationContext.log(`Fetched ${chatHistory.length} messages from Redis for podbot.${username}.${sessionId}`)

    // Get context from AMS
    const context = await fetchContext(username, sessionId, invocationContext)

    return { chatHistory, context }
  } catch (error) {
    invocationContext.error(`Error fetching session for podbot.${username}.${sessionId}`, error)
    throw error
  }
}

/**
 * Send a message and get AI response, returning full chat + context
 */
export async function sendMessage(
  username: string,
  sessionId: string,
  message: string,
  invocationContext: InvocationContext
): Promise<ChatWithContext> {
  try {
    // Get existing AMS working memory
    const { context, messages } = await readWorkingMemory('podbot', username, sessionId, invocationContext)
    invocationContext.log(`Fetched working memory for podbot.${username}.${sessionId}`)

    // Convert to LangChain message format
    const contextMessage = context ? new SystemMessage(`Previous conversation context: ${context}`) : undefined
    const chatMessages = messages.map(amsToLangChainMessage)
    const userMessage = new HumanMessage(message)
    const langChainMessages = contextMessage
      ? [contextMessage, ...chatMessages, userMessage]
      : [...chatMessages, userMessage]
    invocationContext.log(`Converted messages to LangChain format for podbot.${username}.${sessionId}`)

    // Get AI response
    const aiMessage = await generateResponse(langChainMessages, invocationContext)
    const aiText = aiMessage.text
    invocationContext.log(`Generated AI response for podbot.${username}.${sessionId}`)

    // Convert back to AMS format and save
    const amsUserMessage = langchainToAmsMessage(userMessage)
    const amsAiMessage = langchainToAmsMessage(aiMessage)
    const amsMessages = [...messages, amsUserMessage, amsAiMessage]
    invocationContext.log(`Converted messages to AMS format for podbot.${username}.${sessionId}`)

    // Save updated working memory to AMS
    await replaceWorkingMemory(
      sessionId,
      config.amsContextWindowMax,
      {
        namespace: 'podbot',
        user_id: username,
        session_id: sessionId,
        context: context,
        messages: amsMessages
      },
      invocationContext
    )
    invocationContext.log(`Updated working memory for podbot.${username}.${sessionId}`)

    // Save messages to Redis Stream
    const userChatMessage: ChatMessage = { role: 'user', content: message }
    const aiChatMessage: ChatMessage = { role: 'podbot', content: aiText }
    await appendToChat('podbot', username, sessionId, userChatMessage, invocationContext)
    await appendToChat('podbot', username, sessionId, aiChatMessage, invocationContext)
    invocationContext.log(`Saved messages to Redis stream for podbot.${username}.${sessionId}`)

    // Return updated chat + context
    const chatHistory = await readChat('podbot', username, sessionId, invocationContext)
    const updatedContext = await fetchContext(username, sessionId, invocationContext)

    return { chatHistory, context: updatedContext }
  } catch (error) {
    invocationContext.error(`Error processing message for podbot.${username}.${sessionId}`, error)
    throw error
  }
}

// ========== Memories (AMS Long-Term Memory) ==========

/**
 * Fetch all long-term memories for a user
 */
export async function fetchUserMemories(
  username: string,
  invocationContext: InvocationContext
): Promise<Memory[]> {
  // TODO: Implement when AMS long-term memory API is available
  invocationContext.log(`Fetching memories for podbot.${username} (not yet implemented)`)
  return []
}

// ========== Helper Functions ==========

/**
 * Fetch context from AMS (summary + recent messages + relevant memories)
 */
async function fetchContext(
  username: string,
  sessionId: string,
  invocationContext: InvocationContext
): Promise<Context> {
  try {
    const { context, messages } = await readWorkingMemory('podbot', username, sessionId, invocationContext)

    return {
      summary: context || '',
      recentMessages: messages.map(amsToContextMessage),
      relevantMemories: [] // TODO: Fetch from AMS long-term memory when available
    }
  } catch (error) {
    invocationContext.error(`Error fetching context for podbot.${username}.${sessionId}`, error)
    return {
      summary: '',
      recentMessages: [],
      relevantMemories: []
    }
  }
}

/**
 * Convert AMS message to LangChain message
 */
function amsToLangChainMessage(amsMessage: AmsMessage): BaseMessage {
  switch (amsMessage.role) {
    case AmsRole.USER:
      return new HumanMessage(amsMessage.content)
    case AmsRole.ASSISTANT:
      return new AIMessage(amsMessage.content)
    default:
      throw new Error(`Unknown AMS role: ${amsMessage.role}`)
  }
}

/**
 * Convert AMS message to context message
 */
function amsToContextMessage(message: AmsMessage): ContextMessage {
  return {
    role: message.role as 'user' | 'assistant',
    content: message.content
  }
}

/**
 * Convert LangChain message to AMS message
 */
function langchainToAmsMessage(message: BaseMessage): AmsMessage {
  switch (message.constructor) {
    case AIMessage:
      return { role: AmsRole.ASSISTANT, content: message.text }
    case HumanMessage:
      return { role: AmsRole.USER, content: message.text }
    case SystemMessage:
      throw new Error('SystemMessage cannot be converted to AmsMessage')
    default:
      throw new Error(`Unknown LangChain message type: ${message.constructor.name}`)
  }
}
