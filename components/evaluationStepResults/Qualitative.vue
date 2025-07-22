<template>
  <h2>User Stories</h2>
  <UCarousel 
    v-slot="{ item }"
    :items="result"
    class="w-full max-w-2xl mx-auto my-4"
		auto-height
    dots
    loop
		:ui="{dot: 'bg-default w-2 h-1',
		container: 'transition-[height]',
		controls: 'absolute -top-8 inset-x-2',}"
  >
    <UCard class="flex flex-col justify-between p-4 dark text-default text-sm">
      <p>
        Als <strong>{{ item.role }}</strong> möchte ich <em>{{ item.goal }}</em
        >, damit {{ item.benefit }}.
      </p>
    </UCard>
  </UCarousel>
</template>

<script setup lang="ts">
defineProps<{
  result: Array
}>()
</script>