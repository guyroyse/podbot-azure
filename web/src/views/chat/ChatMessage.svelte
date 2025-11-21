<script lang="ts">
  import { marked } from 'marked'
  import UserState from '@state/user-state.svelte.ts'

  const userState = UserState.instance

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
    if (role === 'user') return userState.username ?? 'user'
    return 'Podbot'
  }
</script>

<li class="mb-1.5 py-2 list-none">
  <div class="font-bold {getUsernameColor(role)}">
    {getUsername(role)}:
  </div>
  {#if role === 'podbot'}
    <div class="bot-message">
      {@html renderMarkdown(content)}
    </div>
  {:else}
    <div>{content}</div>
  {/if}
</li>
