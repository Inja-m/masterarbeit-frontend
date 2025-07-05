<template>
  <div class="w-full">
    <!-- Stepper Kopf mit Icons und Trennlinien -->
    <div
      class="flex items-center justify-between bg-accented rounded-lg p-4 mb-2"
    >
      <template v-for="(step, index) in steps" :key="index">
        <div
          class="flex items-center"
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
                index <= completedStep
                  ? 'bg-inverted text-inverted'
                  : 'border text-toned',
                index === activeStep
                  ? 'outline outline-2 outline-primary outline-offset-2'
                  : ''
              ]"
            >
              <component
                :is="getIconComponent(step.icon)"
                class="w-4 h-4 md:w-6 md:h-6"
                stroke-width="2"
              />
            </div>
          </div>

          <!-- Trennlinie, außer beim letzten -->
          <div
            v-if="index < steps.length - 1"
            class="flex-grow bg-inverted mx-1 md:mx-2"
            :class="index < completedStep ? 'h-[1.5px]' : 'h-[0.5px]'"
          />
        </div>
      </template>
    </div>

    <!-- Content -->
    <UCard variant="soft">
      <template #header>
        <div class="flex items-center justify-between">
          <h1>{{ activeStep + 1 }}. {{ steps[activeStep].name }}</h1>
          <UBadge
            :color="getStatusColor(steps[activeStep].evaluationStatus)"
            variant="outline"
            size="sm"
            class="font-normal rounded-full whitespace-nowrap"
          >
            {{
              steps[activeStep].evaluationStatus === 'done'
                ? 'Abgeschlossen'
                : steps[activeStep].evaluationStatus === 'inProgress'
                ? 'In Bearbeitung'
                : 'Ausstehend'
            }}
          </UBadge>
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
					<TextBlock  v-if="['digitalisation', 'qualitative', 'publication'].includes(steps[activeStep].identifier) === true" :result="steps[activeStep].result" />
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

defineProps<{
  steps: { name: string; description: string; icon: string }[]
  completedStep: number
}>()

function getIconComponent(component: string) {
  return (
    LucideIcons[component as keyof typeof LucideIcons] || LucideIcons.HelpCircle
  )
}

function setActive(index: number) {
  activeStep.value = index
}

function getStatusColor(status: string) {
  switch (status) {
    case 'done':
      return 'success'
    case 'inProgress':
      return 'info'
    default:
      return 'warning'
  }
}

watch(
		() => user.value?.id,
		async (newId, oldId) => {
			console.log('watch')
			if (newId && newId !== oldId) {
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
