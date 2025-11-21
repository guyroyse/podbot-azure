<script lang="ts">
  import type LongTermMemoryViewModel from './long-term-memory-view-model.svelte.ts'
  import LongTermMemoryList from './LongTermMemoryList.svelte'
  import InfoCard from '@components/InfoCard.svelte'

  interface Props {
    viewModel: LongTermMemoryViewModel
  }

  let { viewModel }: Props = $props()
</script>

<div class="flex-1 flex flex-col min-h-0 p-5 overflow-y-auto">
  <h2 class="text-xl font-bold mb-4 text-redis-black dark:text-redis-white">
    <i class="fa-solid fa-brain mr-2"></i>
    Long-term Memory
  </h2>

  <p class="text-sm text-redis-black-50 dark:text-redis-dusk-50 mb-6">
    These are facts and preferences that Agent Memory Server has extracted from your conversations and stored for
    future reference.
  </p>

  {#if viewModel.hasMemories}
    <LongTermMemoryList memories={viewModel.memories} />
  {:else}
    <div class="flex-1 flex items-center justify-center">
      <InfoCard
        icon="fa-solid fa-brain"
        description="No long-term memories yet. Keep chatting and PodBot will remember important details about your preferences."
      />
    </div>
  {/if}
</div>
