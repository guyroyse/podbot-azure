<script lang="ts">
  import SessionListPanel from '@components/SessionListPanel.svelte'
  import WorkingMemoryPanel from './WorkingMemoryPanel.svelte'
  import WorkingMemoryState from '@state/working-memory-state.svelte.ts'
  import SessionState from '@state/session-state.svelte.ts'
  import UserState from '@state/user-state.svelte.ts'

  const workingMemoryState = WorkingMemoryState.instance
  const sessionState = SessionState.instance
  const userState = UserState.instance

  $effect(() => {
    const sessionId = sessionState.currentSessionId
    const username = userState.username
    if (sessionId && username) {
      workingMemoryState.loadWorkingMemory(sessionId, username)
    }
  })
</script>

<div class="flex-1 flex min-h-0">
  <SessionListPanel />
  <WorkingMemoryPanel />
</div>
