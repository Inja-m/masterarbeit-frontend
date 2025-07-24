<template>
  <UModal v-model:open="internalOpen" :close="{ color: 'neutral' }">
    <template #body>
      <h1>{{ location.name }}</h1>
      <img
        v-if="location.floorPlan?.url"
        :src="getImageUrl(location.floorPlan.url)"
        class="max-h-64"
        alt="Lageplan"
      />
			<h2 class="py-2 mt-6">Anfahrt/Lage</h2>
      <p v-if="location.directions">{{ location.directions }}</p>
      <IconText
        v-if="location.maps"
        :icon="SquareArrowOutUpRight"
        :text="
          location.maps.length > 30
            ? location.maps.slice(0, 30) + '…'
            : location.maps
        "
        :to="location.maps"
        external
      />
      <h2 class="py-2">Kapazität</h2>
      {{ location.personNumber }} Personen

      <h2 class="py-2">Materialien</h2>
      <div
        v-if="location.material"
        v-html="marked(location.material)"
        class="prose max-w-none pl-2"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { SquareArrowOutUpRight } from 'lucide-vue-next'
import { marked } from 'marked'
const { getImageUrl } = useImageUrl()

const props = defineProps<{
  location: Array
}>()

const emit = defineEmits(['update:open'])

const internalOpen = ref(props.open)

watch(
  () => props.open,
  (val) => {
    internalOpen.value = val
  }
)
watch(internalOpen, (val) => {
  emit('update:open', val)
})
</script>
