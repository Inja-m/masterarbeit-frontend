<template>
  <div v-if="hasAnyPicture">
    <h2>Die folgenden Materialien von dir wurden digitalisiert:</h2>
    <div v-for="res in result" :key="res.id">
      <ul class="list-disc list-inside my-4">
        <li v-for="pictureGroup in res.Pictures" :key="pictureGroup.id">
          {{ pictureGroup.title }}
        </li>
      </ul>
    </div>
  </div>
  <div class="flex justify-end">
    <UModal
      v-model:open="modalOpen"
      title="Artefakte des Workshops"
      :close="{
        color: 'neutral',
        variant: 'ghost',
        class: 'overflow-y-auto max-h-screen rounded-full'
      }"
    >
      <UButton
        icon="i-lucide-eye"
        label="Artefakte ansehen"
        color="primary"
      />
      <template #body>
        <UCarousel
          v-slot="{ item }"
          loop
          dots
					auto-height
          :items="carouselItems"
					:ui="{
						container: 'transition-[height]',
						controls: 'absolute -top-8 inset-x-12',
						dots: '-top-7',
					}"
          class="w-full max-w-xs mx-auto mb-6"
        >
          <h2 class="flex justify-center">{{ item.title }}</h2>
          <img :src="item.src" width="320" height="320" class="rounded-lg" >
					<div v-if="item.description" v-html="marked(item.description)" class="prose max-w-none mt-2" />
        </UCarousel>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import { useImageUrl } from '@/composables/useImageUrl'
const { getImageUrl } = useImageUrl()

const props = defineProps<{
  result: {
    type: Array
    required: true
  }
}>()

const hasAnyPicture = computed(() =>
  props.result?.some(res =>
    Array.isArray(res.Pictures) && res.Pictures.length > 0
  )
)

const modalOpen = ref(false)
const carouselItems = computed(() => {
  const items = []
  for (const res of props.result) {
    for (const pictureGroup of res.Pictures) {
      for (const image of pictureGroup.pictures) {
        items.push({
          src: getImageUrl(image),
          alt: image.name || 'Bild',
          title: pictureGroup.title || null,
					description: pictureGroup.description || null,
        })
      }
    }
  }
  return items
})
</script>
