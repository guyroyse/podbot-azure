<script lang="ts">
  import Header from '@components/header/Header.svelte'
  import Footer from '@components/Footer.svelte'
  import LoginView from '@views/login/LoginView.svelte'
  import ChatView from '@views/chat/ChatView.svelte'
  import WorkingMemoryView from '@views/working-memory/WorkingMemoryView.svelte'
  import LongTermMemoryView from '@views/long-term-memory/LongTermMemoryView.svelte'
  import AppRouter, { Route } from '@app/app-router.svelte.ts'

  const appRouter = AppRouter.instance
</script>

<Header />

<main class="flex-1 flex min-h-0">
  {#if appRouter.currentRoute === Route.Login}
    <LoginView />
  {:else if appRouter.currentRoute === Route.Chat}
    <ChatView />
  {:else if appRouter.currentRoute === Route.Session}
    <WorkingMemoryView />
  {:else if appRouter.currentRoute === Route.Memory}
    <LongTermMemoryView />
  {:else}
    <div class="flex-1 flex items-center justify-center">
      <p class="text-xl text-redis-hyper">Unknown route</p>
    </div>
  {/if}
</main>

<Footer />
