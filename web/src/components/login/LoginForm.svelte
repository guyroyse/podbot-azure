<script lang="ts">
  import LoginViewModel from './login-view-model.svelte'

  const viewModel = LoginViewModel.instance
</script>

<form
  onsubmit={viewModel.handleLogin}
  autocomplete="off"
  class="bg-redis-white dark:bg-redis-black border border-redis-black-10 dark:border-redis-dusk-70 rounded-lg p-8 space-y-6"
>
  <div>
    <label for="username" class="block text-sm font-semibold mb-2 text-redis-black dark:text-redis-white">
      Username
    </label>
    <input
      type="text"
      id="username"
      bind:value={viewModel.username}
      placeholder="Enter your username"
      autocomplete="off"
      data-1p-ignore
      data-lpignore="true"
      class="w-full bg-redis-light-gray dark:bg-redis-black-90 border-2 border-redis-black-10 dark:border-redis-dusk-70 text-redis-black dark:text-redis-white px-4 py-3 font-sans text-base rounded-lg focus:outline-none focus:border-redis-hyper"
      required
    />
  </div>

  <div>
    <label for="password" class="block text-sm font-semibold mb-2 text-redis-black dark:text-redis-white">
      Password
    </label>
    <input
      type="password"
      id="password"
      bind:value={viewModel.password}
      placeholder="Enter your password"
      autocomplete="off"
      data-1p-ignore
      data-lpignore="true"
      class="w-full bg-redis-light-gray dark:bg-redis-black-90 border-2 border-redis-black-10 dark:border-redis-dusk-70 text-redis-black dark:text-redis-white px-4 py-3 font-sans text-base rounded-lg focus:outline-none focus:border-redis-hyper"
      required
    />
  </div>

  <button
    type="submit"
    disabled={!viewModel.canLogin}
    class="w-full bg-redis-hyper hover:bg-redis-deep-hyper border-2 border-redis-hyper hover:border-redis-deep-hyper text-white px-4 py-3 font-sans text-base font-semibold cursor-pointer rounded-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-px focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,68,56,0.3)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
  >
    <i class="fa-solid fa-right-to-bracket"></i>
    <span>Login</span>
  </button>
</form>
