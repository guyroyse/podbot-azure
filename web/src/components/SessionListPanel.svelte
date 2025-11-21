<script lang="ts">
  import SessionState from '@state/session-state.svelte.ts'
  import ChatState from '@state/chat-state.svelte.ts'
  import UserState from '@state/user-state.svelte.ts'

  const sessionState = SessionState.instance
  const chatState = ChatState.instance
  const userState = UserState.instance

  function selectSession(id: string) {
    sessionState.selectSession(id)
    // Reload chat for the selected session
    if (userState.username) {
      chatState.loadMessages(id, userState.username)
    }
  }

  function createNewSession() {
    const id = sessionState.createSession()
    // Clear chat for new session
    chatState.clear()
  }

  function formatLastActive(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays} days ago`
  }
</script>

<aside class="w-64 bg-redis-white dark:bg-redis-black border-r border-redis-black-10 dark:border-redis-dusk-70 flex flex-col shrink-0">
  <div class="p-4 border-b border-redis-black-10 dark:border-redis-dusk-70">
    <button
      type="button"
      onclick={createNewSession}
      class="w-full bg-redis-hyper hover:bg-redis-deep-hyper text-white px-4 py-2 font-sans text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
    >
      <i class="fa-solid fa-plus"></i>
      <span>New Session</span>
    </button>
  </div>

  <div class="flex-1 overflow-y-auto p-2">
    {#if sessionState.isLoading}
      <div class="flex items-center justify-center py-8">
        <i class="fa-solid fa-spinner fa-spin text-redis-hyper"></i>
      </div>
    {:else if sessionState.sessions.length === 0}
      <div class="text-center py-8 text-redis-black-50 dark:text-redis-dusk-50 text-sm">
        No sessions yet
      </div>
    {:else}
      <ul class="space-y-1">
        {#each sessionState.sessions as session}
          <li>
            <button
              type="button"
              onclick={() => selectSession(session.id)}
              class="w-full text-left px-3 py-2 rounded-lg transition-all duration-200 {sessionState.currentSessionId === session.id
                ? 'bg-redis-black-10 dark:bg-redis-dusk text-redis-black dark:text-redis-white cursor-default'
                : 'hover:bg-redis-black-10 dark:hover:bg-redis-dusk text-redis-black dark:text-redis-white cursor-pointer'}"
            >
              <div class="font-semibold text-sm truncate">{session.name}</div>
              <div class="text-xs opacity-60 mt-1">{formatLastActive(session.lastActive)}</div>
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</aside>
