import { app } from '@azure/functions'

import { fetchSessionsHandler } from './fetch-sessions.js'
import { createSessionHandler } from './create-session.js'
import { fetchSessionHandler } from './fetch-session.js'
import { sendMessageHandler } from './send-message.js'
import { fetchMemoriesHandler } from './fetch-memories.js'

// GET /api/sessions/{username} - List all sessions for user
app.http('fetchSessions', {
  methods: ['GET'],
  route: 'sessions/{username}',
  authLevel: 'anonymous',
  handler: fetchSessionsHandler
})

// POST /api/sessions/{username} - Create new session
app.http('createSession', {
  methods: ['POST'],
  route: 'sessions/{username}',
  authLevel: 'anonymous',
  handler: createSessionHandler
})

// GET /api/sessions/{username}/{sessionId} - Get chat history + context for session
app.http('fetchSession', {
  methods: ['GET'],
  route: 'sessions/{username}/{sessionId}',
  authLevel: 'anonymous',
  handler: fetchSessionHandler
})

// POST /api/sessions/{username}/{sessionId} - Send message to session
app.http('sendMessage', {
  methods: ['POST'],
  route: 'sessions/{username}/{sessionId}',
  authLevel: 'anonymous',
  handler: sendMessageHandler
})

// GET /api/memories/{username} - Fetch all long-term memories for user
app.http('fetchMemories', {
  methods: ['GET'],
  route: 'memories/{username}',
  authLevel: 'anonymous',
  handler: fetchMemoriesHandler
})
