import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

import { clearSession } from '@services/chat-service.js'
import responses from './http-responses.js'

export async function deleteSession(
  request: HttpRequest,
  invocationContext: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Get username from route parameters
    const username = request.params.username
    if (!username) {
      invocationContext.log('No username provided')
      return responses.badRequest('Username is required')
    }

    // Clear chat history for the user
    invocationContext.log(`Clearing session for user: ${username}`)
    await clearSession(username, invocationContext)

    // Return success response
    invocationContext.log(`Cleared session for user: ${username}`)
    return responses.ok({ success: true })
  } catch (error) {
    invocationContext.error('Error clearing session:', error)
    return responses.serverError('Failed to clear session')
  }
}
