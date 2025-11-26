<script lang="ts">
  import SessionViewModel from './session-view-model.svelte'

  interface Props {
    id: string
    lastActive: string // ISO date string
  }

  let { id, lastActive }: Props = $props()

  const viewModel = SessionViewModel.instance

  function selectSession() {
    viewModel.selectSession(id)
  }

  function formatLastActive(isoDate: string): string {
    const now = new Date()
    const then = new Date(isoDate)
    const diffMs = now.getTime() - then.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays} days ago`
  }
</script>

<li>
  <button
    type="button"
    onclick={selectSession}
    class="w-full text-left px-3 py-2 rounded-lg transition-all duration-200 {viewModel.currentSessionId === id
      ? 'bg-redis-black-10 dark:bg-redis-dusk text-redis-black dark:text-redis-white cursor-default'
      : 'hover:bg-redis-black-10 dark:hover:bg-redis-dusk text-redis-black dark:text-redis-white cursor-pointer'}"
  >
    <div class="font-semibold text-sm truncate">{id}</div>
    <div class="text-xs opacity-60 mt-1">{formatLastActive(lastActive)}</div>
  </button>
</li>
