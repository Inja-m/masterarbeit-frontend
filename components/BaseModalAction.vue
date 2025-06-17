<template>
  <UModal
    v-model:open="internalOpen"
    fullscreen
    :title="title"
    :close="{ color: 'neutral' }"
  >
    <UButton
      :label="label"
      :icon="icon"
      color="neutral"
      variant="ghost"
    />
    
    <template #body>
      <slot name="body" />
    </template>

    <template  v-if="slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  label: string
  icon?: string
  open: boolean
}>()

const slots = useSlots()
const emit = defineEmits(['update:open'])

const internalOpen = ref(props.open)

watch(() => props.open, (val) => {
  internalOpen.value = val
})
watch(internalOpen, (val) => {
  emit('update:open', val)
})
</script>