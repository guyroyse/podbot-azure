<script lang="ts">
  import SessionListPanel from '@components/SessionListPanel.svelte'
  import ChatMessages from './ChatMessages.svelte'
  import ChatInput from './ChatInput.svelte'
  import ChatViewModel from './chat-view-model.svelte.ts'

  const viewModel = new ChatViewModel()

  $effect(() => {
    viewModel.loadChatHistory()
  })
</script>

<div class="flex-1 flex min-h-0">
  <SessionListPanel />
  <div class="flex-1 flex flex-col min-h-0">
    <ChatMessages {viewModel} />
    <ChatInput {viewModel} />
  </div>
</div>
