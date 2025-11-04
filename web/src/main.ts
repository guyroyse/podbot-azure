import './style.css'

import { DisplayView } from './views/display-view'
import { SessionView } from './views/session-view'
import { SenderView } from './views/sender-view'
import { fetchSessionHistory, sendMessage, clearSession, ChatRole, type ChatMessage } from './model'

// Initialize views
const displayView = new DisplayView()
const sessionView = new SessionView()
const senderView = new SenderView()

// Wire up session events
sessionView.addEventListener('load', async (event) => {
  const username = (event as CustomEvent).detail.username

  if (!username) {
    displayView.showError('Please enter a username')
    return
  }

  sessionView.setLoadingState(true)
  senderView.setLoading(true)

  try {
    const messages = await fetchSessionHistory(username)
    displayView.clear()
    messages.forEach(message => displayView.displayMessage(message))
  } catch (error) {
    if (error instanceof Error) {
      displayView.showError(`Failed to load session: ${error.message}`)
    } else {
      displayView.showError('Failed to load session. Please check if the chat API is running.')
    }
  } finally {
    sessionView.setLoadingState(false)
    senderView.setLoading(false)
    updateButtonStates()
  }
})

sessionView.addEventListener('clear', async (event) => {
  const username = (event as CustomEvent).detail.username

  if (!username) {
    displayView.showError('Please enter a username')
    return
  }

  if (!confirm(`Are you sure you want to clear the session for ${username}?`)) {
    return
  }

  sessionView.setLoadingState(true)
  senderView.setLoading(true)

  try {
    await clearSession(username)
    displayView.clear()
  } catch (error) {
    if (error instanceof Error) {
      displayView.showError(`Failed to clear session: ${error.message}`)
    } else {
      displayView.showError('Failed to clear session. Please check if the chat API is running.')
    }
  } finally {
    sessionView.setLoadingState(false)
    senderView.setLoading(false)
  }
})

// Wire up message sender events
senderView.addEventListener('send', async (event) => {
  const message = (event as CustomEvent).detail.message
  const username = sessionView.getUsername()

  if (!username) {
    displayView.showError('Please enter a username')
    return
  }

  senderView.clearInput()
  senderView.setLoading(true)

  // Display user message
  const userMessage: ChatMessage = { role: ChatRole.USER, content: message }
  displayView.displayMessage(userMessage)

  try {
    const response = await sendMessage(username, message)

    // Display bot response
    const botMessage: ChatMessage = { role: ChatRole.PODBOT, content: response.response }
    displayView.displayMessage(botMessage)
  } catch (error) {
    if (error instanceof Error) {
      displayView.showError(`Failed to send message: ${error.message}`)
    } else {
      displayView.showError('Failed to send message. Please check if the chat API is running.')
    }
  } finally {
    senderView.setLoading(false)
    updateButtonStates()
  }
})

senderView.addEventListener('inputchange', () => {
  updateButtonStates()
})

sessionView.addEventListener('usernamechange', () => {
  updateButtonStates()
})

// Helper to update button states
function updateButtonStates(): void {
  const hasUsername = sessionView.getUsername().length > 0
  const hasMessage = senderView.hasMessage()

  sessionView.setLoadingState(senderView.isLoading())
  senderView.updateButtonState(hasUsername, hasMessage)
}

// Initial setup
updateButtonStates()

// Focus appropriate input
if (!sessionView.getUsername()) {
  sessionView.focus()
} else {
  senderView.focus()
}
