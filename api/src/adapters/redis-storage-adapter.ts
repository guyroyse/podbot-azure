import type { InvocationContext } from '@azure/functions'
import { createClient } from 'redis'
import { ulid } from 'ulid'
import { config } from '@/config.js'

let redisClient: ReturnType<typeof createClient> | null = null

export type SortedSetMember = {
  value: string
  score: number
}

export type StreamMessage = {
  id: string
  message: {
    [key: string]: string
  }
}

export async function listUserSessions(
  namespace: string,
  userId: string,
  invocationContext: InvocationContext
): Promise<SortedSetMember[]> {
  const client = await fetchRedisClient()
  const key = buildSessionsKey(namespace, userId)

  invocationContext.log(`[Redis] Fetching sessions from sorted set: ${key}`)

  // Get all session IDs with scores (epoch time), sorted by score descending
  const members = await client.zRangeWithScores(key, 0, -1, { REV: true })

  invocationContext.log(`[Redis] Found ${members.length} sessions`)

  return members
}

/**
 * Create a new session for a user
 */
export async function createUserSession(
  namespace: string,
  userId: string,
  invocationContext: InvocationContext
): Promise<SortedSetMember> {
  const client = await fetchRedisClient()
  const sessionId = ulid()
  const now = Date.now()
  const key = buildSessionsKey(namespace, userId)

  invocationContext.log(`[Redis] Creating session ${sessionId} in sorted set: ${key}`)

  // Add session to sorted set with current timestamp as score
  await client.zAdd(key, { score: now, value: sessionId })

  invocationContext.log(`[Redis] Created session ${sessionId}`)

  return {
    value: sessionId,
    score: now
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
  role: string,
  content: string,
  invocationContext: InvocationContext
): Promise<void> {
  const client = await fetchRedisClient()
  const key = buildStreamKey(namespace, userId, sessionId)

  invocationContext.log(`[Redis] Appending message to stream: ${key}`)

  // Add message to stream (Redis will auto-generate ID with timestamp)
  const messageId = await client.xAdd(key, '*', {
    role,
    content
  })

  invocationContext.log(`[Redis] Added message ${messageId} to stream`)

  // Update session's last active time
  await touchSession(namespace, userId, sessionId, invocationContext)
}

/**
 * Read all messages from a session's chat stream
 */
export async function readChat(
  namespace: string,
  userId: string,
  sessionId: string,
  invocationContext: InvocationContext
): Promise<StreamMessage[]> {
  const client = await fetchRedisClient()
  const key = buildStreamKey(namespace, userId, sessionId)

  invocationContext.log(`[Redis] Reading stream: ${key}`)

  // Read all messages from stream (from beginning to end)
  const messages = await client.xRange(key, '-', '+')

  invocationContext.log(`[Redis] Found ${messages.length} messages in stream`)

  return messages
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
