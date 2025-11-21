<script lang="ts">
  import ChatState from '@state/chat-state.svelte.ts'
  import SessionState from '@state/session-state.svelte.ts'
  import UserState from '@state/user-state.svelte.ts'

  const chatState = ChatState.instance
  const sessionState = SessionState.instance
  const userState = UserState.instance

  let currentMessage = $state('')

  async function handleSend() {
    const message = currentMessage.trim()
    if (!message || chatState.isBusy) return

    const sessionId = sessionState.currentSessionId
    const username = userState.username
    if (!sessionId || !username) return

    currentMessage = ''
    await chatState.sendMessage(sessionId, username, message)
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }
</script>

<div
  class="flex gap-3 items-center p-5 md:px-4 shrink-0"
>
  <input
    class="flex-1 bg-redis-light-gray dark:bg-redis-black-90 border-2 border-redis-black-10 dark:border-redis-dusk-70 text-redis-black dark:text-redis-white px-4 py-3 font-mono text-sm rounded-lg focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
    type="text"
    bind:value={currentMessage}
    onkeydown={handleKeydown}
    placeholder="Ask PodBot anything about podcasts..."
    disabled={chatState.isBusy}
  />
  <button
    type="button"
    onclick={handleSend}
    disabled={chatState.isBusy || !currentMessage.trim()}
    class="bg-redis-hyper hover:bg-redis-deep-hyper border-2 border-redis-hyper hover:border-redis-deep-hyper text-white px-4 py-3 font-sans text-sm font-semibold cursor-pointer rounded-lg transition-all flex items-center gap-2 min-w-20 justify-center focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed md:min-w-12 md:px-3"
  >
    <i class="fa-solid fa-paper-plane text-base md:text-lg"></i>
    <span class="md:hidden">Send</span>
  </button>
</div>
