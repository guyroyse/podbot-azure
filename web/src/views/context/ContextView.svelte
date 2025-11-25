<script lang="ts">
  import AppState from '@root/src/state/app-state.svelte'
  import SessionPanel from '@components/session-panel/SessionPanel.svelte'
  import ContextPanel from './ContextPanel.svelte'

  const appState = AppState.instance

  $effect(() => {
    if (appState.currentSessionId && appState.username) {
      appState.loadContext()
    }
  })
</script>

<div class="flex-1 flex min-h-0">
  <SessionPanel />
  <ContextPanel />
</div>
