import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

import { createNewSession } from '@services/chat-service.js'
import responses from './http-responses.js'

export async function createSessionHandler(
  request: HttpRequest,
  invocationContext: InvocationContext
): Promise<HttpResponseInit> {
  // Get username from route parameters
  const username = request.params.username
  if (!username) {
    invocationContext.log('No username provided')
    return responses.badRequest('Username is required')
  }

  try {
    // Create new session
    invocationContext.log(`Creating session for podbot.${username}`)
    const session = await createNewSession(username, invocationContext)

    // Return new session
    return responses.ok(session)
  } catch (error) {
    invocationContext.error(`Error creating session for podbot.${username}:`, error)
    return responses.serverError('Failed to create session')
  }
}
