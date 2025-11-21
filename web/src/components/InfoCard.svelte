<script lang="ts">
  interface Props {
    icon: string
    description: string
    clazz?: string
  }

  let { icon, description, clazz = '' }: Props = $props()
</script>

<div class="bg-redis-violet-20 dark:bg-redis-dusk border-l-4 border-redis-violet rounded-lg p-4 flex items-center gap-3 {clazz}">
  <i class="{icon} text-redis-violet text-3xl"></i>
  <p class="text-sm text-redis-black dark:text-redis-white pl-2">
    {description}
  </p>
</div>
