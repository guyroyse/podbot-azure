import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

import { clearSession } from '@services/chat-service.js'
import responses from './http-responses.js'

export async function deleteSession(
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
    // Clear chat history for the user
    invocationContext.log(`Clearing session for podbot.${username}.${sessionId}`)
    await clearSession(username, sessionId, invocationContext)

    // Return success response
    invocationContext.log(`Cleared session for podbot.${username}.${sessionId}`)
    return responses.ok({ success: true })
  } catch (error) {
    invocationContext.error(`Error clearing session for podbot.${username}.${sessionId}:`, error)
    return responses.serverError('Failed to clear session')
  }
}
