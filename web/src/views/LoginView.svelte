<script lang="ts">
  import LoginForm from '@components/login/LoginForm.svelte'
  import LoginStatus from '@components/login/LoginStatus.svelte'
</script>

<div class="flex-1 flex flex-col items-center justify-center p-6">
  <div class="max-w-md w-full">
    <LoginForm />
    <LoginStatus />
  </div>
</div>
