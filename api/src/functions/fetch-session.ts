import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

import { fetchSession } from '@services/chat-service.js'
import responses from './http-responses.js'

export async function fetchSessionHandler(
  request: HttpRequest,
  invocationContext: InvocationContext
): Promise<HttpResponseInit> {
  // Get username from route parameters
  const username = request.params.username
  if (!username) {
    invocationContext.log('No username provided')
    return responses.badRequest('Username is required')
  }

  // Get the sessionId from route parameters
  const sessionId = request.params.sessionId
  if (!sessionId) {
    invocationContext.log('No sessionId provided')
    return responses.badRequest('Session ID is required')
  }

  try {
    // Fetch chat history + context
    invocationContext.log(`Fetching session for podbot.${username}.${sessionId}`)
    const chatWithContext = await fetchSession(username, sessionId, invocationContext)

    // Return chat + context
    return responses.ok(chatWithContext)
  } catch (error) {
    invocationContext.error(`Error getting session for podbot.${username}.${sessionId}:`, error)
    return responses.serverError('Failed to get session')
  }
}
