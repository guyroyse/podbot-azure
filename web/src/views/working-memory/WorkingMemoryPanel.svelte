<script lang="ts">
  import WorkingMemoryState from '@state/working-memory-state.svelte.ts'
  import WorkingMemoryContext from './WorkingMemoryContext.svelte'
  import WorkingMemoryMessages from './WorkingMemoryMessages.svelte'
  import InfoCard from '@components/InfoCard.svelte'

  const workingMemoryState = WorkingMemoryState.instance
</script>

<div class="flex-1 flex flex-col min-h-0 p-5 overflow-y-auto">
  <h2 class="text-xl font-bold mb-4 text-redis-black dark:text-redis-white">
    <i class="fa-solid fa-note-sticky mr-2"></i>
    Working Memory
  </h2>

  <p class="text-sm text-redis-black-50 dark:text-redis-dusk-50 mb-6">
    This is the current conversation context that Agent Memory Server maintains. It includes a compacted summary of
    older messages and recent conversation history.
  </p>

  {#if workingMemoryState.hasContext || workingMemoryState.messageCount > 0}
    {#if workingMemoryState.hasContext}
      <WorkingMemoryContext context={workingMemoryState.context} />
    {/if}

    {#if workingMemoryState.messageCount > 0}
      <WorkingMemoryMessages messages={workingMemoryState.messages} />
    {/if}
  {:else}
    <div class="flex-1 flex items-center justify-center">
      <InfoCard
        icon="fa-solid fa-note-sticky"
        description="No working memory yet. Start a conversation and your session context will appear here."
      />
    </div>
  {/if}
</div>
