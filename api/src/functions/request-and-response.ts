import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

import { processMessage } from '@services/chat-service.js'
import responses from './http-responses.js'

export async function requestAndResponse(
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

  // Get user message from request body
  const body = await request.json()
  const { message } = body as { message?: string }
  if (!message) {
    invocationContext.log('No message provided')
    return responses.badRequest('Message is required')
  }

  try {
    // Process the message
    invocationContext.log(`Processing message for podbot.${username}.${sessionId}`)
    const response = await processMessage(username, sessionId, message, invocationContext)

    // Return the response
    invocationContext.log(`Generated response for podbot.${username}.${sessionId}`)
    return responses.ok({ response })
  } catch (error) {
    invocationContext.error(`Error processing chat for podbot.${username}.${sessionId}:`, error)
    return responses.serverError('Failed to process chat')
  }
}
