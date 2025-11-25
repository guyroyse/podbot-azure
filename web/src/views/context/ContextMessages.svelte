<script lang="ts">
  import AppState from '@root/src/state/app-state.svelte'
  import ContextMessage from './ContextMessage.svelte'

  const appState = AppState.instance
</script>

{#if appState.contextMessageCount > 0}
  <h3 class="text-sm font-semibold uppercase tracking-wide text-redis-black-50 dark:text-redis-dusk-50 mb-2">
    Recent Messages ({appState.contextMessageCount})
  </h3>
  <ul class="space-y-3">
    {#each appState.contextMessages as message}
      <ContextMessage role={message.role} content={message.content} />
    {/each}
  </ul>
{/if}
