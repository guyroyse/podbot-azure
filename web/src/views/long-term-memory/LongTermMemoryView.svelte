<script lang="ts">
  import SessionListPanel from '@components/SessionListPanel.svelte'
  import LongTermMemoryPanel from './LongTermMemoryPanel.svelte'
  import LongTermMemoryViewModel from './long-term-memory-view-model.svelte.ts'

  const viewModel = new LongTermMemoryViewModel()

  $effect(() => {
    viewModel.loadMemories()
  })
</script>

<div class="flex-1 flex min-h-0">
  <SessionListPanel />
  <LongTermMemoryPanel {viewModel} />
</div>
