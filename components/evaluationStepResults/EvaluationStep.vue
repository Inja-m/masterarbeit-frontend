<template>
  <div v-if="hasAnyPicture">
    <UAccordion type="multiple" :items="accordionItems">
      <template #body="{ item }">
        <div v-if="hasAnyPicture">
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
              />
            </div>
          </div>
        </div>
        <div v-if="item.links.length">
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
        <div
          v-if="item.description"
          v-html="marked(item.description)"
          class="prose max-w-none"
        />
      </template>
    </UAccordion>
  </div>

  <div v-if="researchResults.length > 0">
    <h2>Forschungs Ergebnisse</h2>
    <div v-for="item in researchResults" :key="item.id">
      <!--<h2 class="text-xl font-bold mb-2">{{ item.title }}</h2>-->
      <UAccordion type="multiple" :items="getAccordionItems(item)">
        <template #body="{ item }">
  <template v-if="item.type === 'abstract' || item.type === 'results' || item.type === 'discussion'">
    <div class="prose max-w-none" v-html="marked(item.data)"></div>
  </template>

  <template v-else-if="item.type === 'questions'">
    <div class="space-y-4">
      <div v-for="(q, qIndex) in item.data" :key="qIndex">
        <p><strong>F{{ qIndex + 1 }}:</strong> {{ q.question }}</p>
        <div v-if="q.subquestion?.length" class="mt-2 space-y-2 pl-4">
          <p
            v-for="(sq, sqIndex) in q.subquestion"
            :key="sqIndex"
          >
            <strong>F{{ qIndex + 1 }}.{{ sqIndex + 1 }}:</strong> {{ sq.subquestion }}
          </p>
        </div>
      </div>
    </div>
  </template>

  <template v-else-if="item.type === 'researchDesign'">
    <div class="space-y-4">
      <img
        v-if="item.data.picture"
        :src="getImageUrl(item.data.picture)"
        :alt="item.data.picture.name"
        class="rounded max-w-full"
      />
      <div
        v-if="item.data.description"
        class="prose max-w-none"
        v-html="marked(item.data.description)"
      ></div>
    </div>
  </template>

  <template v-else-if="item.type === 'bibliography'">
    <ol>
      <li
        v-for="(entry, index) in item.data"
        :key="index"
      >
        [{{ index + 1 }}] {{ entry.author }}, <i>{{ entry.title }}</i>, {{ entry.year }}.
      </li>
    </ol>
  </template>

  <template v-else-if="item.type === 'context'">
    <div class="space-y-4">
      <div
        v-for="(t, index) in item.data.text"
        :key="'text' + index"
        class="prose max-w-none"
        v-html="marked(t.text || '')"
      ></div>
      <UButton
        v-for="(l, index) in item.data.link"
        :key="'link' + index"
        icon="i-lucide-external-link"
        :label="l.label || l.link"
        color="neutral"
        variant="ghost"
        :href="l.link"
        target="_blank"
      />
    </div>
  </template>
</template>
      </UAccordion>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import { useImageUrl } from '@/composables/useImageUrl'
import type { WorkshopResultBlock } from '~/types/Components'
const { getImageUrl } = useImageUrl()

const props = defineProps<{
  result: WorkshopResultBlock[]
}>()

console.log(props.result)
const totalityResults = computed(
  () =>
    props.result?.filter((res) => res.__component === 'media.totality') || []
)
const researchResults = computed(
  () =>
    props.result?.filter((res) => res.__component === 'media.research') || []
)

const hasAnyPicture = computed(() =>
  totalityResults.value.some((res) => res.Pictures?.length > 0)
)

const accordionItems = computed(() => {
  return totalityResults.value.flatMap(
    (res) =>
      res.Pictures?.map((picGroup) => ({
        label: picGroup.title,
        pictures: picGroup.pictures,
        links: picGroup.Link,
        description: picGroup.description
      })) ?? []
  )
})
function getAccordionItems(item: any) {
  const items = []

  if (item.abstract) {
    items.push({
      label: 'Abstract',
      type: 'abstract',
      data: item.abstract
    })
  }

  if (item.researchQuestion?.length) {
    items.push({
      label: 'Forschungsfragen',
      type: 'questions',
      data: item.researchQuestion
    })
  }

  if (item.researchDesign?.description || item.researchDesign?.picture) {
    items.push({
      label: 'Forschungsdesign',
      type: 'researchDesign',
      data: item.researchDesign
    })
  }

  if (item.results) {
    items.push({
      label: 'Ergebnisse',
      type: 'results',
      data: item.results
    })
  }

  if (item.disscussion) {
    items.push({
      label: 'Diskussion',
      type: 'discussion',
      data: item.disscussion
    })
  }

  if (item.bibliography?.length) {
    items.push({
      label: 'Literatur',
      type: 'bibliography',
      data: item.bibliography
    })
  }

  if (
    item.context &&
    (item.context.text?.length || item.context.link?.length)
  ) {
		console.log(item.context.text)
    items.push({
      label: 'Forschungskontext',
      type: 'context',
      data: item.context
    })
  }

  return items
}
</script>
