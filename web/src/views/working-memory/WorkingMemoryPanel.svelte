<script lang="ts">
  import type WorkingMemoryViewModel from './working-memory-view-model.svelte.ts'
  import WorkingMemoryContext from './WorkingMemoryContext.svelte'
  import WorkingMemoryMessages from './WorkingMemoryMessages.svelte'
  import InfoCard from '@components/InfoCard.svelte'

  interface Props {
    viewModel: WorkingMemoryViewModel
  }

  let { viewModel }: Props = $props()
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

  {#if viewModel.hasContext || viewModel.messageCount > 0}
    {#if viewModel.hasContext}
      <WorkingMemoryContext context={viewModel.context} />
    {/if}

    {#if viewModel.messageCount > 0}
      <WorkingMemoryMessages messages={viewModel.messages} />
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
