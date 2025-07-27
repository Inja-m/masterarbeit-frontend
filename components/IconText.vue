<template>
  <div class="flex items-center space-x-2 py-1">
		<component :is="icon" :size="20" stroke-width="1.5" />
     <template v-if="link || to">
      <a
        :href="to"
        class="text-base underline transition"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ text }}
      </a>
    </template>
    <template v-else>
      <div class="text-base">{{ text }}</div>
    </template>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  icon: Component
  text: string
	link?: boolean
	to?: string
}>()

</script>