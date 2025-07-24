<template>
  <Section>
    <div class="flex items-center justify-between">
      <UBadge
        size="sm"
        :style="{
          backgroundColor: resWorkshop.data.workshop_serie.project.color
        }"
        class="dark"
        >{{ resWorkshop.data.workshop_serie.project.name }}</UBadge
      >
      <NotificationSetting
        :title="
          isWorkshop
            ? 'Für Mitteilungen melde dich bitte an'
            : `Mitteilungen zu „${resWorkshop.data.workshop_serie.name}“ verwalten`
        "
      />
    </div>
    <h1 class="py-2">
      {{ resWorkshop.data.workshop_serie.name }}
    </h1>

    <IconText :icon="Calendar" :text="formatDate(resWorkshop.data.date)" />
    <IconText :icon="MapPin" :text="resWorkshop.data.location" />
    <div v-if="resWorkshop.data.reward">
      <IconText :icon="HandCoins" :text="resWorkshop.data.reward" />
    </div>
    <UAccordion
      type="multiple"
      :items="items"
      :ui="{
        item: 'border-b-0',
        label: 'text-base font-normal',
        trigger: 'py-1 gap-3',
        leadingIcon: 'shrink-0 size-6 text-lg'
      }"
    >
      <template #body="{ item }">
        <div v-if="item.label === 'Beschreibung'">
          {{ resWorkshop.data.workshop_serie.description }}
        </div>
        <div v-else>
          <p>
            Hier findest du alle allgemeinen Workshop-Materialien und Vorlagen,
            wie z. B. die Datenschutzerklärung oder Informationsblätter.
            Persönliche Daten oder individuelle Ausfüllungen sind darin nicht
            enthalten.
          </p>
          <div
            v-for="image in resWorkshop.data.workshop_serie.material"
            :key="image.id"
          >
            <div v-if="image.mime === 'application/pdf'">
              <UButton
                icon="i-lucide-download"
                :label="image.name"
                color="neutral"
                variant="ghost"
                :href="getImageUrl(image)"
                target="_blank"
                download
              />
            </div>
            <div v-else>
              <img
                :src="getImageUrl(image)"
                :alt="image.name"
                class="rounded"
              />
            </div>
          </div>
        </div>
      </template>
    </UAccordion>
  </Section>
  <div v-if="orderedSteps?.length" class="mb-4 mx-2">
    <CustomStepper :steps="orderedSteps" :completed-step="completedStep" />
  </div>
  <Section>
    <h1 class="text-center">Team hinter dem Workshop</h1>

    <UCarousel loop arrows  auto-height :items="resTeamMembers.data" v-slot="{ item }">
<UCard class="bg-primary-100 light text-default my-4">
  <div class="flex flex-col items-center text-center">
    <UAvatar
      :src="getImageUrl(item?.team_member?.profilepicture?.url)"
      :alt="item.team_member.username"
      :ui="{ root: 'size-24 text-3xl' }"
    />

    <h2  class="mt-4">{{ item.team_member.username }}</h2>
    <p class="text-sm text-gray-500">{{ item.workshopRole }}</p>
    <div v-if="item.team_member.email" class="text-sm">
			<div class="flex items-center space-x-1 py-1">
		<AtSign :size="14" stroke-width="1.5" />
      <a :href="`mailto:${item.team_member.email}`" class="underline">
        {{ item.team_member.email }}
      </a>
		</div>
    </div>
    <div v-if="item.team_member.phone" class="text-sm">
			<div class="flex items-center space-x-1 py-1">
		<Phone :size="14" stroke-width="1.5" />
      <a :href="`tel:${item.team_member.phone}`" class="underline">
        {{ item.team_member.phone }}
      </a>
		</div>
    </div>
  </div>

  <p class="py-4 px-2 text-center">„{{ item.description }}“</p>
</UCard>
    </UCarousel>
  </Section>
  <Section bg-color="bg-primary-100" class="light text-default">
    <h1 class="text-center pb-4">
      Wir freuen uns über einen weiteren Austausch
    </h1>
    <UForm :state="state" class="pb-4" @submit="onSubmit">
      <UFormField name="anonym">
        <template v-if="isWorkshop">
          <p class="text-sm text-gray-500 pb-2">
            Diese Nachricht wird automatisch anonym gesendet.
          </p>
        </template>
        <template v-else>
          <UCheckbox
            v-model="state.anonym"
            label="Nachricht anonym senden"
            color="neutral"
            class="pb-2"
          />
        </template>
      </UFormField>
      <UFormField name="message">
        <UTextarea
          v-model="state.message"
          color="neutral"
          placeholder="Deine Nachricht..."
          class="w-full focus:bg-transparent"
        >
          <template #trailing>
            <UButton
              icon="i-heroicons-paper-airplane"
              color="neutral"
              variant="link"
              type="submit"
            />
          </template>
        </UTextarea>
      </UFormField>
    </UForm>
    <div v-for="message in messages" :key="message.id">
      <Message
        :time="formatRelativeTime(message.createdAt)"
        :name="message.author?.username || 'Anonym'"
        :message="message.message"
      />
    </div>
  </Section>
</template>

<script setup lang="ts">
import { Calendar, MapPin, HandCoins, Phone, AtSign } from 'lucide-vue-next'
import type { Workshop } from '../../types/Workshop'
import type { WorkshopResult } from '~/types/WorkshopResult'
import type { Message } from '~/types/Message'
import { useImageUrl } from '@/composables/useImageUrl'
const { getImageUrl } = useImageUrl()

definePageMeta({
  name: 'workshop-details',
  header: {
    title: 'Co-Design Workshop',
    back: false,
    showHeader: true
  }
})

const { findOne, find, create } = useStrapi()
const route = useRoute()
const workshopID = route.params.id as string
const messages = ref<Message[]>([])
const user = await useUserWithRole()
const isWorkshop = computed(() => user.value?.role?.name === 'Workshop')

const state = reactive({
  anonym: false,
  message: undefined
})

onMounted(async () => {
  loadMessages()
  loadEvaluationSteps()
  if (!isWorkshop.value) {
    route.meta.header = {
      title: 'Co-Design Workshop',
      back: true,
      showHeader: true
    }
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', async (event) => {
      loadEvaluationSteps()
    })
  }
})
const resWorkshop = await findOne<Workshop>('workshops', workshopID, {
  populate: { workshop_serie: { populate: '*' } }
})
const items = ref<AccordionItem[]>([
  {
    label: 'Beschreibung',
    icon: 'i-lucide-scroll-text'
  },
  {
    label: 'Materialien',
    icon: 'i-lucide-folder-open'
  }
])
const resWorkshopResults = await find<WorkshopResult>('workshop-results', {
  filters: {
    workshop: {
      id: {
        $eq: resWorkshop.data.id
      }
    }
  },
  populate: {
    evaluation_step: true,
    Result: {
      on: {
        'media.totality': {
          populate: {
            Pictures: {
              populate: '*'
            },
            workshop_group: true,
            Text: true
          }
        }
      }
    }
  }
})

const resTeamMembers = await find('teams', {
  filters: {
    workshop_serie: resWorkshop.data.workshop_serie.id // filtert Teams zur Workshop-Serie
  },
  populate: {
    team_member: {
      populate: { profilepicture: true }
    }
  },
	sort: ['workshopRole:desc']
})
console.log(resTeamMembers)

const userGroupId = ref<string>()
const filteredResults = ref<any[]>([])
const stepsWithStatus = ref<any[]>([])

const orderedSteps = computed(() => {
  const order = { done: 0, inProgress: 1, todo: 2 }
  return [...stepsWithStatus.value].sort((a, b) => {
    const aStatus = a.evaluationStatus ?? 'todo'
    const bStatus = b.evaluationStatus ?? 'todo'
    return order[aStatus] - order[bStatus]
  })
})

const completedStep = computed(() =>
  orderedSteps.value.findLastIndex(
    (step: any) => step.evaluationStatus === 'done'
  )
)

async function loadEvaluationSteps() {
  if (!resWorkshop.data.workshop_serie?.evaluation_steps) {
    console.warn(
      'Keine evaluation_steps im Workshop vorhanden:',
      resWorkshop.data
    )
  }
  console.log('hier')
  const userParticipationRes = await find('participations', {
    filters: {
      user: { id: { $eq: user.value.id } }
    },
    populate: {
      workshop_group: {
        populate: ['workshop']
      }
    }
  })

  const userParticipation = userParticipationRes.data.find(
    (p) => p.workshop_group?.workshop?.documentId === workshopID
  )

  if (!userParticipation) return

  userGroupId.value = userParticipation.workshop_group.documentId

  const filtered = resWorkshopResults.data
    .map((result) => {
      const filteredComponents = result.Result.filter((component) => {
        return (
          component.__component === 'media.totality' &&
          (!component.workshop_group ||
            component.workshop_group.documentId === userGroupId.value)
        )
      })

      return {
        ...result,
        Result: filteredComponents
      }
    })
    .filter(
      (result) =>
        result.Result.length > 0 || result.evaluationStatus !== 'to do'
    )

  filteredResults.value = filtered

  stepsWithStatus.value = resWorkshop.data.workshop_serie.evaluation_steps.map(
    (step: any) => {
      const result = filtered.find((r: any) => r.evaluation_step.id === step.id)
      return {
        ...step,
        evaluationStatus: result?.evaluationStatus ?? 'todo',
        estimatedCompletion: result?.estimatedCompletion,
        result: result?.Result
      }
    }
  )
}

async function loadMessages() {
  try {
    const result = await find<Message>('messages', {
      filters: {
        workshop: {
          id: {
            $eq: resWorkshop.data.id
          }
        }
      },
      populate: ['author'],
      sort: ['createdAt:desc']
    })

    messages.value = result.data
  } catch (error) {
    console.error('Fehler beim Laden der Nachrichten:', error)
  }
}

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  try {
    if (!state.message || state.message.trim() === '') {
      return
    }
    const message: any = {
      message: state.message,
      workshop: resWorkshop.data.documentId
    }
    if (!isWorkshop.value && !state.anonym) {
      //console.log(user.value)
      message.author = user.value.id
    }
    await create('messages', message)
    state.anonym = false
    state.message = undefined
    await loadMessages()
  } catch (err) {
    console.error('Fehler beim Senden:', err)
  }
}
</script>
