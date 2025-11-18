import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

import { processMessage } from '@services/chat-service.js'
import responses from './http-responses.js'

export async function requestAndResponse(
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

    // Get user message from request body
    const body = await request.json()
    const { message } = body as { message?: string }
    if (!message) {
      invocationContext.log('No message provided')
      return responses.badRequest('Message is required')
    }

    // Process the message
    invocationContext.log(`Processing message for user: ${username}`)
    const response = await processMessage(username, message, invocationContext)

    // Return the response
    invocationContext.log(`Generated response for user: ${username}`)
    return responses.ok({ response })
  } catch (error) {
    invocationContext.error('Error processing chat:', error)
    return responses.serverError('Failed to process chat')
  }
}
