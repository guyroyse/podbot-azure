<script lang="ts">
  import LongTermMemoryItem from './LongTermMemoryItem.svelte'

  type Memory = {
    id: string
    content: string
    created: string
  }

  interface Props {
    memories: Memory[]
  }

  let { memories }: Props = $props()
</script>

<div>
  <h3 class="text-sm font-semibold uppercase tracking-wide text-redis-black-50 dark:text-redis-dusk-50 mb-2">
    Memories ({memories.length})
  </h3>
  <ul class="space-y-3">
    {#each memories as memory}
      <LongTermMemoryItem content={memory.content} created={memory.created} />
    {/each}
  </ul>
</div>
