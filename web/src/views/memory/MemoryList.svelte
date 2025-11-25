<script lang="ts">
  import AppState from '@root/src/state/app-state.svelte'
  import MemoryItem from './MemoryItem.svelte'

  const appState = AppState.instance
</script>

{#if appState.hasMemories}
  <h3 class="text-sm font-semibold uppercase tracking-wide text-redis-black-50 dark:text-redis-dusk-50 mb-2">
    Memories ({appState.memoryCount})
  </h3>
  <ul class="space-y-3">
    {#each appState.memories as memory}
      <MemoryItem content={memory.content} created={memory.created} />
    {/each}
  </ul>
{/if}
