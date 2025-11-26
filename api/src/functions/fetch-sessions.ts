import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

import { fetchSessions } from '@services/chat-service.js'
import responses from './http-responses.js'

export async function fetchSessionsHandler(
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
    // Fetch list of sessions
    invocationContext.log(`Fetching sessions for podbot.${username}`)
    const sessions = await fetchSessions(username, invocationContext)

    // Return sessions list
    return responses.ok(sessions)
  } catch (error) {
    invocationContext.error(`Error getting sessions for podbot.${username}:`, error)
    return responses.serverError('Failed to get sessions')
  }
}
