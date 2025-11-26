import type { InvocationContext } from '@azure/functions'
import { createClient } from 'redis'
import { ulid } from 'ulid'
import { config } from '@/config.js'

let redisClient: ReturnType<typeof createClient> | null = null

export type Session = {
  id: string
  lastActive: string // ISO 8601 date string
}

export type ChatMessage = {
  role: 'user' | 'podbot'
  content: string
}

export async function listUserSessions(
  namespace: string,
  userId: string,
  invocationContext: InvocationContext
): Promise<Session[]> {
  const client = await fetchRedisClient()
  const key = buildSessionsKey(namespace, userId)

  invocationContext.log(`[Redis] Fetching sessions from sorted set: ${key}`)

  // Get all session IDs with scores (epoch time), sorted by score descending
  const sessions = await client.zRangeWithScores(key, 0, -1, { REV: true })

  invocationContext.log(`[Redis] Found ${sessions.length} sessions`)

  return sessions.map(session => ({
    id: session.value,
    lastActive: new Date(session.score).toISOString()
  }))
}

/**
 * Create a new session for a user
 */
export async function createUserSession(
  namespace: string,
  userId: string,
  invocationContext: InvocationContext
): Promise<Session> {
  const client = await fetchRedisClient()
  const sessionId = ulid()
  const now = Date.now()
  const key = buildSessionsKey(namespace, userId)

  invocationContext.log(`[Redis] Creating session ${sessionId} in sorted set: ${key}`)

  // Add session to sorted set with current timestamp as score
  await client.zAdd(key, { score: now, value: sessionId })

  invocationContext.log(`[Redis] Created session ${sessionId}`)

  return {
    id: sessionId,
    lastActive: new Date(now).toISOString()
  }
}

/**
 * Update session's last active timestamp
 */
export async function touchSession(
  namespace: string,
  userId: string,
  sessionId: string,
  invocationContext: InvocationContext
): Promise<void> {
  const client = await fetchRedisClient()
  const key = buildSessionsKey(namespace, userId)
  const now = Date.now()

  invocationContext.log(`[Redis] Updating last active time for session ${sessionId}`)

  // Update score (timestamp) for this session
  await client.zAdd(key, { score: now, value: sessionId })
}

/**
 * Append a message to a session's chat stream
 */
export async function appendToChat(
  namespace: string,
  userId: string,
  sessionId: string,
  message: ChatMessage,
  invocationContext: InvocationContext
): Promise<string> {
  const client = await fetchRedisClient()
  const key = buildStreamKey(namespace, userId, sessionId)

  invocationContext.log(`[Redis] Appending message to stream: ${key}`)

  // Add message to stream (Redis will auto-generate ID with timestamp)
  const messageId = await client.xAdd(key, '*', {
    role: message.role,
    content: message.content
  })

  invocationContext.log(`[Redis] Added message ${messageId} to stream`)

  // Update session's last active time
  await touchSession(namespace, userId, sessionId, invocationContext)

  return messageId
}

/**
 * Read all messages from a session's chat stream
 */
export async function readChat(
  namespace: string,
  userId: string,
  sessionId: string,
  invocationContext: InvocationContext
): Promise<ChatMessage[]> {
  const client = await fetchRedisClient()
  const key = buildStreamKey(namespace, userId, sessionId)

  invocationContext.log(`[Redis] Reading stream: ${key}`)

  // Read all messages from stream (from beginning to end)
  const messages = await client.xRange(key, '-', '+')

  invocationContext.log(`[Redis] Found ${messages.length} messages in stream`)

  return messages.map(msg => ({
    role: msg.message.role as 'user' | 'podbot',
    content: msg.message.content
  }))
}

/**
 * Get or create Redis client
 */
async function fetchRedisClient() {
  if (!redisClient) redisClient = await createClient({ url: config.redisUrl }).connect()
  return redisClient
}

/**
 * Get sorted set key for user's sessions
 */
function buildSessionsKey(namespace: string, userId: string): string {
  return `${namespace}:${userId}:sessions`
}

/**
 * Get stream key for session chat history
 */
function buildStreamKey(namespace: string, userId: string, sessionId: string): string {
  return `${namespace}:${userId}:${sessionId}:chat`
}
