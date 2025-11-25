<script lang="ts">
  import { marked } from 'marked'
  import AppState from '@state/app-state.svelte.ts'

  const appState = AppState.instance

  type MessageRole = 'user' | 'podbot'

  interface Props {
    role: MessageRole
    content: string
  }

  let { role, content }: Props = $props()

  function renderMarkdown(text: string): string {
    return marked.parse(text, { async: false }) as string
  }

  function getUsernameColor(role: MessageRole): string {
    if (role === 'user') return 'text-redis-sky-blue'
    return 'text-redis-hyper dark:text-redis-yellow'
  }

  function getUsername(role: MessageRole): string {
    if (role === 'user') return appState.username ?? 'user'
    return 'podbot'
  }
</script>

<li class="mb-2 list-none">
  <div class="font-bold {getUsernameColor(role)}">
    {getUsername(role)}:
  </div>
  <div>
    {#if role === 'podbot'}
      {@html renderMarkdown(content)}
    {:else}
      {content}
    {/if}
  </div>
</li>
