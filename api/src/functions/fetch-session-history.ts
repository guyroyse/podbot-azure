import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

import type { ChatMessage } from '@services/chat-service.js'
import { fetchHistory } from '@services/chat-service.js'
import responses from './http-responses.js'

export async function fetchSessionHistory(
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

    // Fetch chat history
    invocationContext.log(`Fetching history for user: ${username}`)
    const chatHistory: ChatMessage[] = await fetchHistory(username, invocationContext)

    // Return chat history
    return responses.ok(chatHistory)
  } catch (error) {
    invocationContext.error('Error getting session:', error)
    return responses.serverError('Failed to get session')
  }
}
