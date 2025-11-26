import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

import { fetchUserMemories } from '@services/chat-service.js'
import responses from './http-responses.js'

export async function fetchMemoriesHandler(
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
    // Fetch memories for user
    invocationContext.log(`Fetching memories for podbot.${username}`)
    const memories = await fetchUserMemories(username, invocationContext)

    // Return memories list
    return responses.ok(memories)
  } catch (error) {
    invocationContext.error(`Error getting memories for podbot.${username}:`, error)
    return responses.serverError('Failed to get memories')
  }
}
