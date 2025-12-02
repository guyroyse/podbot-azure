<script lang="ts">
  import { marked } from 'marked'
  import ChatViewModel from './chat-view-model.svelte'
  import { roleToDisplayName } from '@src/utils/role-utils'
  import type { Role } from '@services/podbot-service'

  const viewModel = ChatViewModel.instance

  interface Props {
    role: Role
    content: string
  }

  let { role, content }: Props = $props()

  const username = $derived(role === 'user' ? (viewModel.username ?? 'user') : roleToDisplayName(role))
  const usernameColor = $derived(role === 'user' ? 'text-redis-sky-blue' : 'text-redis-hyper dark:text-redis-yellow')
  const renderedContent = $derived(role === 'assistant' ? (marked.parse(content, { async: false }) as string) : content)
</script>

<li class="mb-2 list-none">
  <div class="font-bold {usernameColor}">
    {username}:
  </div>
  <div class="prose prose-invert max-w-none">
    {#if role === 'assistant'}
      {@html renderedContent}
    {:else}
      {renderedContent}
    {/if}
  </div>
</li>
