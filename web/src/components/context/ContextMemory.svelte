<script lang="ts">
  interface Props {
    content: string
    createdAt: string
  }

  let { content, createdAt }: Props = $props()
</script>

<li class="bg-redis-white dark:bg-redis-black-90 border border-redis-black-10 dark:border-redis-dusk-70 rounded-lg p-3">
  <p class="text-sm text-redis-black dark:text-redis-white leading-relaxed mb-1">
    {content}
  </p>
  <p class="text-xs text-redis-black-50 dark:text-redis-dusk-50">
    {createdAt}
  </p>
</li>
