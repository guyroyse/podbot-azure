<script lang="ts">
  interface Props {
    context: string
  }

  let { context }: Props = $props()
</script>

<div class="mb-6">
  <h3 class="text-sm font-semibold uppercase tracking-wide text-redis-black-50 dark:text-redis-dusk-50 mb-2">
    Compacted Context
  </h3>
  <div class="bg-redis-white dark:bg-redis-black-90 border border-redis-black-10 dark:border-redis-dusk-70 rounded-lg p-4">
    <p class="text-sm text-redis-black dark:text-redis-white leading-relaxed font-mono">
      {context}
    </p>
  </div>
</div>
