<script lang="ts">
  import SessionListPanel from '@components/SessionListPanel.svelte'
  import LongTermMemoryPanel from './LongTermMemoryPanel.svelte'
  import LongTermMemoryState from '@state/long-term-memory-state.svelte.ts'
  import UserState from '@state/user-state.svelte.ts'

  const longTermMemoryState = LongTermMemoryState.instance
  const userState = UserState.instance

  $effect(() => {
    const username = userState.username
    if (username) {
      longTermMemoryState.loadMemories(username)
    }
  })
</script>

<div class="flex-1 flex min-h-0">
  <SessionListPanel />
  <LongTermMemoryPanel />
</div>
