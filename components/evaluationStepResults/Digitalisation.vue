<template>
  <div v-if="hasAnyPicture">
    <h2>Die folgenden Materialien von dir wurden digitalisiert:</h2>
    <div v-for="res in result" :key="res.id">
      <ul class="my-4">
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
      <UButton icon="i-lucide-eye" label="Artefakte ansehen" color="primary" />
      <template #body>
        <UCarousel
          v-slot="{ item }"
          loop
          dots
          :items="carouselItems"
          :ui="{
            dot: 'w-3 h-1',
            controls: 'absolute -top-8 inset-x-2'
          }"
          class="w-full max-w-xs mx-auto mb-6"
        >
          <h2 class="flex justify-center">{{ item.title }}</h2>
          <img v-if="item.src" :src="item.src" class="rounded-lg" />
          <div
            v-if="item.description"
            v-html="marked(item.description)"
            class="prose max-w-none mt-2"
          />
          <div v-if="item.links" class="flex flex-col">
            <UButton
              v-for="(link, index) in item.links"
              :key="index"
              :to="link"
              :label="link"
              icon="i-lucide-link"
              color="neutral"
              variant="ghost"
            />
          </div>
        </UCarousel>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import { useImageUrl } from '@/composables/useImageUrl'
import type { WorkshopResultBlock } from '~/types/Components'
const { getImageUrl } = useImageUrl()

const props = defineProps<{
  result: {
    type: WorkshopResultBlock[]
  }
}>()
console.log(props.result)
const hasAnyPicture = computed(() =>
  props.result?.some(
    (res) =>
      res.__component === 'media.totality' &&
      Array.isArray(res.Pictures) &&
      res.Pictures.length > 0
  )
)

const modalOpen = ref(false)
const carouselItems = computed(() => {
  const items: {
    src?: string
    alt?: string
    title?: string
    description?: string
    links?: string[]
  }[] = []

  for (const res of props.result) {
    if (res.__component !== 'media.totality') continue

    for (const pictureGroup of res.Pictures || []) {
      const hasPictures =
        Array.isArray(pictureGroup.pictures) && pictureGroup.pictures.length > 0

      if (hasPictures) {
        for (const image of pictureGroup.pictures!) {
          items.push({
            src: getImageUrl(image),
            alt: image.name || 'Bild',
            title: pictureGroup.title,
            description: pictureGroup.description,
            links: pictureGroup.Link?.map((linkObj) => linkObj.link) ?? []
          })
        }
      } else if (pictureGroup.description || pictureGroup.Link?.link) {
        // Es gibt keine Bilder, aber Beschreibung oder Link → trotzdem push
        items.push({
          title: pictureGroup.title,
          description: pictureGroup.description,
          links: pictureGroup.Link?.map((linkObj) => linkObj.link) ?? []
        })
      }
    }
  }

  return items
})
console.log(carouselItems.value)
</script>
