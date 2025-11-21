<script lang="ts">
  import WorkingMemoryMessage from './WorkingMemoryMessage.svelte'

  type Message = {
    role: 'user' | 'assistant'
    content: string
  }

  interface Props {
    messages: Message[]
  }

  let { messages }: Props = $props()
</script>

<div>
  <h3 class="text-sm font-semibold uppercase tracking-wide text-redis-black-50 dark:text-redis-dusk-50 mb-2">
    Recent Messages ({messages.length})
  </h3>
  <ul class="space-y-3">
    {#each messages as message}
      <WorkingMemoryMessage role={message.role} content={message.content} />
    {/each}
  </ul>
</div>
