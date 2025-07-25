<template>
  <h2>User Stories</h2>
	<p class="text-sm">
		Die hier dargestellten User Stories wurden im Rahmen einer qualitativen Auswertung erstellt. 
		Ihr <strong>Status</strong> wird <strong>unabhängig</strong> von dieser Auswertung gepflegt und durch die Enticklung aktualisiert.  
		<br><br>
    Das bedeutet: Auch wenn eine User Story bereits im Rahmen der Auswertung dokumentiert wurde, 
		kann ihr Status später, basierend auf dem Entwicklungsfortschritt, angepasst werden.
	</p>
	
  <UCarousel
    v-slot="{ item }"
    :items="result"
    class="w-full max-w-2xl mx-auto mt-8"
    auto-height
    dots
    loop
    :ui="{
      dot: 'bg-default w-2 h-1',
      container: 'transition-[height]',
      controls: 'absolute -top-8 inset-x-2'
    }"
  >
    <UCard class="text-sm" :class="[getColor(item.developmentStatus)]">
      <template #header>
        Als <strong>{{ item.role }}</strong> möchte ich <em>{{ item.goal }}</em
        >, damit {{ item.benefit }}.
      </template>
      <template v-if="item.developmentStatus !== 'todo'" #default>
        <div v-if="item.result.title">
          <h1>{{ item.result.title }}</h1>
        </div>
        <div
          v-if="item.result.description"
          v-html="marked(item.result.description)"
          class="prose max-w-none my-2"
        />
        <div v-if="item.result.pictures" class="flex justify-end">
          <UModal
            v-model:open="modalOpen"
            title="Ergebniss der User Storie"
            :close="{
              color: 'neutral',
              variant: 'ghost',
              class: 'overflow-y-auto max-h-screen rounded-full'
            }"
          >
            <UButton
              icon="i-lucide-eye"
              label="Ergebnisse ansehen"
              color="primary"
							class="mt-2"
            />
            <template #body>
              <div v-for="image in item.result.pictures" :key="image.id">
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
            <img :src="getImageUrl(image)" :alt="image.name" class="rounded" />
          </div>
        </div>
        <div v-if="item.result.Link.length" class="mt-2 space-y-2">
          <UButton
            v-for="linkItem in item.result.Link"
            :key="linkItem.id"
            icon="i-lucide-external-link"
            :label="linkItem.link"
            color="neutral"
            variant="ghost"
            :href="linkItem.link"
            target="_blank"
          />
        </div>
				<div v-else-if="item.result.Link.length">
					<UButton
            v-for="linkItem in item.result.Link"
            :key="linkItem.id"
            icon="i-lucide-external-link"
            :label="linkItem.link"
            color="neutral"
            variant="ghost"
            :href="linkItem.link"
            target="_blank"
          />
				</div>
            </template>
          </UModal>
        </div>
        
      </template>
    </UCard>
  </UCarousel>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import { useImageUrl } from '@/composables/useImageUrl'
const { getImageUrl } = useImageUrl()

defineProps<{
  result: Array
}>()

function getColor(status: string) {
  switch (status) {
    case 'done':
      return 'border bg-done dark:text-inverted'
    case 'inProgress':
      return 'border bg-inProgress dark:text-inverted'
    default:
      return 'border bg-todo dark:text-inverted'
  }
}
</script>
