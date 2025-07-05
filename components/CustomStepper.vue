<template>
  <div class="w-full">
    <!-- Stepper Kopf mit Icons und Trennlinien -->
    <div
      class="flex items-center justify-between bg-accented rounded-lg p-4 mb-2"
    >
      <template v-for="(step, index) in steps" :key="index">
        <div
          class="flex items-baseline"
          :class="{ 'flex-1': index < steps.length - 1 }"
        >
          <!-- Step Icon -->
          <div
            class="flex flex-col items-center cursor-pointer z-10"
            @click="setActive(index)"
          >
            <div
              class="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full transition-all"
              :class="[
                getStepColorClass(steps[index].evaluationStatus),
                index === activeStep
                  ? 'outline outline-2 outline-neutal outline-offset-2'
                  : ''
              ]"
            >
              <component
                :is="getIconComponent(step.icon)"
                class="w-4 h-4 md:w-6 md:h-6"
                stroke-width="2"
              />
            </div>
            <div class="text-xs mt-1 text-center text-muted">
              {{ getStatusLabel(steps[index].evaluationStatus) }}
            </div>
          </div>

          <!-- Trennlinie, außer beim letzten -->
          <div
            v-if="index < steps.length - 1"
            class="flex-grow bg-inverted mx-1 md:mx-2"
            :class="index < completedStep ? 'h-[0.5px]' : 'h-[0.5px]'"
          />
        </div>
      </template>
    </div>

    <!-- Content -->
    <UCard variant="soft">
      <template #header>
        <div class="flex items-center justify-between">
          <h1>{{ activeStep + 1 }}. {{ steps[activeStep].name }}</h1>
        </div>
      </template>
      <div
        v-html="marked(steps[activeStep].description)"
        class="prose max-w-none"
      />

      <div v-if="steps[activeStep].evaluationStatus === 'done'" class="mt-4">
        <div v-if="!isWorkshop">
          <Digitisation
            v-if="steps[activeStep].identifier === 'digitalisation'"
            :result="steps[activeStep].result"
          />
          <Qualitative
            v-else-if="
              steps[activeStep].identifier === 'qualitative' &&
              userStories.data &&
              userStories.data.length > 0
            "
            :result="userStories.data"
          />

          <template v-else-if="steps[activeStep].identifier === 'publication'">
            <h2>Veröffentlichte Materialien</h2>
            <EvaluationStep :result="steps[activeStep].result" />
          </template>

          <template v-else>
            <TextBlock :result="steps[activeStep].result" />
            <EvaluationStep :result="steps[activeStep].result" />
          </template>
          <TextBlock
            v-if="
              ['digitalisation', 'qualitative', 'publication'].includes(
                steps[activeStep].identifier
              ) === true
            "
            :result="steps[activeStep].result"
          />
        </div>
        <div v-if="isWorkshop">
          <UAlert color="neutral" variant="subtle">
            <template #description>
              Melde dich an, um noch weitere Informationen erhalten.
            </template>
            <template #actions>
              <UModal fullscreen>
                <UButton label="Anmelden" color="neutral" variant="subtle" />
                <template #body>
                  <div class="m-2">
                    <LoginForm v-if="user?.role?.name === 'Workshop'" />
                  </div>
                </template>
              </UModal>
            </template>
          </UAlert>
        </div>
      </div>
      <template
        #footer
        v-if="
          steps[activeStep].evaluationStatus !== 'done' &&
          steps[activeStep].estimatedCompletion
        "
      >
        <div class="text-xs">
          Voraussichtlicher Abschluss: KW
          {{ getISOWeek(steps[activeStep].estimatedCompletion).week }}
          {{ getISOWeek(steps[activeStep].estimatedCompletion).year }}
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import * as LucideIcons from 'lucide-vue-next'
import Digitisation from './evaluationStepResults/Digitisation.vue'
import TextBlock from './evaluationStepResults/TextBlock.vue'
import Qualitative from './evaluationStepResults/Qualitative.vue'
import { marked } from 'marked'
import { getISOWeek } from '@/utils/formatRelativeTime'
import EvaluationStep from './evaluationStepResults/EvaluationStep.vue'

const { find } = useStrapi()
const route = useRoute()
const workshopID = route.params.id as string
const user = await useUserWithRole()
const isWorkshop = computed(() => user.value?.role?.name === 'Workshop')
const userStories = ref(null)
const activeStep = ref(0)

const props = defineProps<{
  steps: { name: string; description: string; icon: string }[]
  completedStep: number
}>()
function findActiveStep(steps) {
  // 1. Schritt mit 'inProgress'
  const inProgressIndex = steps.findIndex(s => s.evaluationStatus === 'inProgress')
  if (inProgressIndex !== -1) return inProgressIndex

  // 2. letzter Schritt mit 'done'
  const doneIndices = steps
    .map((s, i) => s.evaluationStatus === 'done' ? i : -1)
    .filter(i => i !== -1)
  if (doneIndices.length > 0) return Math.max(...doneIndices)

  // 3. fallback erster Schritt
  return 0
}
function getIconComponent(component: string) {
  return (
    LucideIcons[component as keyof typeof LucideIcons] || LucideIcons.HelpCircle
  )
}

function setActive(index: number) {
  activeStep.value = index
}

function getStepColorClass(status: string) {
  switch (status) {
    case 'done':
      return 'border bg-green-300 dark:text-inverted'
    case 'inProgress':
      return 'border bg-blue-300 dark:text-inverted'
    default:
      return 'border bg-yellow-100 dark:text-inverted'
  }
}
function getStatusLabel(status: string) {
  switch (status) {
    case 'done':
      return 'Erledigt'
    case 'inProgress':
      return 'Laufend'
    default:
      return 'Offen'
  }
}
watch(
  () => user.value?.id,
  async (newId, oldId) => {
    if (newId && newId !== oldId) {
			activeStep.value = findActiveStep(props.steps)
      if (!isWorkshop.value) {
        userStories.value = await find('user-stories', {
          filters: {
            workshop: {
              documentId: {
                $eq: workshopID
              }
            }
          },
          populate: '*'
        })
      }
    }
  },
  { immediate: true }
)
</script>
