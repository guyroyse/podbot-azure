<script lang="ts">
  import LoginForm from './LoginForm.svelte'
  import InfoCard from '@components/InfoCard.svelte'
</script>

<div class="flex-1 flex flex-col items-center justify-center p-6">
  <div class="max-w-md w-full">
    <LoginForm />

    <InfoCard
      clazz="mt-8"
      icon="fa-solid fa-info-circle"
      description="Enter any username and password to get started. Password is required but will be ignored."
    />
  </div>
</div>
