<script lang="ts">
  import SessionListPanel from '@components/SessionListPanel.svelte'
  import WorkingMemoryPanel from './WorkingMemoryPanel.svelte'
  import WorkingMemoryViewModel from './working-memory-view-model.svelte.ts'

  const viewModel = new WorkingMemoryViewModel()

  $effect(() => {
    viewModel.loadWorkingMemory()
  })
</script>

<div class="flex-1 flex min-h-0">
  <SessionListPanel />
  <WorkingMemoryPanel {viewModel} />
</div>
