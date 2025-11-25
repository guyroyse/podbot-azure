<script lang="ts">
  import AppState from '@root/src/state/app-state.svelte'
  import SessionItem from './SessionItem.svelte'
  import InfoCard from '@components/InfoCard.svelte'

  const appState = AppState.instance

  let areSessionsEmpty = $derived(appState.sessions.length === 0)
  let sessions = $derived(appState.sessions)
</script>

<div class="flex-1 overflow-y-auto p-2">
  {#if areSessionsEmpty}
    <InfoCard clazz="text-center py-8" icon="fa-solid fa-comments" description="No sessions yet" />
  {:else}
    <ul class="space-y-1">
      {#each sessions as session}
        <SessionItem id={session.id} lastActive={session.lastActive} />
      {/each}
    </ul>
  {/if}
</div>
