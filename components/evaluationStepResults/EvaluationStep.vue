<template>
  <div v-if="hasAnyPicture">
    <UAccordion type="multiple" :items="accordionItems">
      <template #body="{ item }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="image in item.pictures" :key="image.id">
            <!-- Link anzeigen, wenn vorhanden -->
            <!-- PDF -->
            <div v-if="image.mime === 'application/pdf'">
              <UButton
                icon="i-lucide-download"
                :label="`${item.label} herunterladen`"
                color="neutral"
                variant="ghost"
                :href="getImageUrl(image)"
                target="_blank"
                download
              />
            </div>

            <!-- Bild -->
            <div v-else>
              <img
                :src="getImageUrl(image)"
                :alt="image.name"
                class="rounded"
              >
            </div>
          </div>
        </div>
        <div v-if="item.links.length" class="mt-2 space-y-2">
          <UButton
            v-for="linkItem in item.links"
            :key="linkItem.id"
            icon="i-lucide-external-link"
            :label="linkItem.link"
            color="neutral"
            variant="ghost"
            :href="linkItem.link"
            target="_blank"
          />
        </div>
				<div v-if="item.description" v-html="marked(item.description)" class="prose max-w-none mt-4" />
      </template>
    </UAccordion>
  </div>

</template>

<script setup lang="ts">
import { marked } from 'marked'
import { useImageUrl } from '@/composables/useImageUrl'
const { getImageUrl } = useImageUrl()

const props = defineProps<{
  result: Array
}>()

const hasAnyPicture = computed(() =>
  props.result?.some((res) => res.Pictures?.length > 0)
)

const accordionItems = computed(() => {
  return props.result.flatMap((res) =>
    res.Pictures.map((picGroup) => ({
      label: picGroup.title,
      pictures: picGroup.pictures,
      links: picGroup.Link,
			description: picGroup.description
    }))
  )
})
</script>
