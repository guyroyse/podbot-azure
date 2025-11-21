<script lang="ts">
  import SessionListPanel from '@components/SessionListPanel.svelte'
  import ChatMessages from './ChatMessages.svelte'
  import ChatInput from './ChatInput.svelte'
  import ChatState from '@state/chat-state.svelte.ts'
  import SessionState from '@state/session-state.svelte.ts'
  import UserState from '@state/user-state.svelte.ts'

  const chatState = ChatState.instance
  const sessionState = SessionState.instance
  const userState = UserState.instance

  $effect(() => {
    const sessionId = sessionState.currentSessionId
    const username = userState.username
    if (sessionId && username) {
      chatState.loadMessages(sessionId, username)
    }
  })
</script>

<div class="flex-1 flex min-h-0">
  <SessionListPanel />
  <div class="flex-1 flex flex-col min-h-0">
    <ChatMessages />
    <ChatInput />
  </div>
</div>
