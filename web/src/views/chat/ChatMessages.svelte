<script lang="ts">
  import LoadingOverlay from '@components/LoadingOverlay.svelte'
  import ChatMessage from './ChatMessage.svelte'
  import InfoCard from '@components/InfoCard.svelte'
  import type ChatViewModel from './chat-view-model.svelte.ts'

  interface Props {
    viewModel: ChatViewModel
  }

  let { viewModel }: Props = $props()
  let messagesContainer: HTMLDivElement

  // Auto-scroll to bottom when new messages arrive
  $effect(() => {
    if (viewModel.messageCount > 0 && messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  })
</script>

<div
  bind:this={messagesContainer}
  class="flex-1 overflow-y-auto p-5 md:p-4 font-mono leading-relaxed min-h-0 relative"
>
  {#if viewModel.messages.length === 0}
    <div class="flex items-center justify-center h-full">
      <InfoCard
        icon="fa-solid fa-comments"
        description="Start a conversation! Ask PodBot for podcast recommendations."
      />
    </div>
  {:else}
    <ul class="list-none p-1 m-0">
      {#each viewModel.messages as message}
        <ChatMessage role={message.role} content={message.content} />
      {/each}
    </ul>
  {/if}

  {#if viewModel.isLoading}
    <LoadingOverlay />
  {/if}
</div>
