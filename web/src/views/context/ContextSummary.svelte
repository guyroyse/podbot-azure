<script lang="ts">
  import AppState from '@root/src/state/app-state.svelte'

  const appState = AppState.instance
</script>

{#if appState.hasContextSummary}
  <h3 class="text-sm font-semibold uppercase tracking-wide text-redis-black-50 dark:text-redis-dusk-50 mb-2">
    Compacted Context
  </h3>
  <p
    class="text-sm text-redis-black dark:text-redis-white leading-relaxed font-mono bg-redis-white dark:bg-redis-black-90 border border-redis-black-10 dark:border-redis-dusk-70 rounded-lg p-4 mb-6"
  >
    {appState.contextSummary}
  </p>
{/if}
