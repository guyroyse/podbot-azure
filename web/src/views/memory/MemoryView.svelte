<script lang="ts">
  import AppState from '@root/src/state/app-state.svelte'
  import SessionPanel from '@components/session-panel/SessionPanel.svelte'
  import MemoryPanel from './MemoryPanel.svelte'

  const appState = AppState.instance

  $effect(() => {
    if (appState.username) {
      appState.loadMemories()
    }
  })
</script>

<div class="flex-1 flex min-h-0">
  <SessionPanel />
  <MemoryPanel />
</div>
