<template>
  <UDrawer v-model:open="isDrawerOpen" :title="title">
    <UButton color="neutral" variant="ghost"  @click="registerSubscription">
      <component :is="currentIcon" :size="22" stroke-width="2" />
    </UButton>

    <template #body>
      <URadioGroup 
				v-if="user?.role?.name !== 'Workshop'"
        v-model="value"
        :items="items"
        variant="table"
        color="neutral"
        indicator="end"
      >
        <!-- Label-Slot für jedes Item -->
        <template #label="{ item }">
          <div class="flex items-center gap-2">
            <component :is="item.icon" :size="18" stroke-width="2"  />
            <span>{{ item.label }}</span>
          </div>
        </template>
      </URadioGroup>
			<LoginForm v-if="user?.role?.name === 'Workshop'" :isRegister="true" @close="onLoginFormClose"/>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import { Bell, BellOff, BellRing } from 'lucide-vue-next'
import type { Participation } from '../types/Participation'
import type { User } from '../types/User'

const props = defineProps<{
  title: string
  workshopId?: number
}>()

const { find, update } = useStrapi()
const user = await useUserWithRole()  as Ref<User | null>

const value = ref<'all' | 'relevant' | 'off'>()
const participationId = ref<string | null>(null)

const isInitialized = ref(false)
const isDrawerOpen = ref(false)

function onLoginFormClose() {
	participationId.value = null
	isInitialized.value = false
  setTimeout(() => {
    registerSubscription()
  }, 1000)
}
onMounted(async () => {
  loadParticipation()
})
// Dein Radio-Items
const items = [
  { label: 'Alle', value: 'all', icon: Bell },
  {
    label: 'Relevantesten',
    description: 'Nur Benachrichtigungen zum Fortschritt.',
    value: 'relevant',
    icon: BellRing,
  },
  { label: 'Aus', value: 'off', icon: BellOff },
]

// Icon abhängig vom Wert
const currentIcon = computed(() => {
  return items.find((i) => i.value === value.value)?.icon
})
const registerSubscription = async () => {
	if(user.value.role.name !== 'Workshop'){
		try {
		await useRegisterSubscription()
  } catch (error) {
    console.error('Fehler beim Registrieren der Subscription:', error)
  }
	}
}

async function loadParticipation() {
	const res = await find<Participation>('participations', {
    filters: {
      user: { id: { $eq: user.value.id } },
      workshop_group: { workshop: { id: { $eq: props.workshopId } } }
    }
  })
  if (res.data.length > 0) {
    const participation = res.data[0]
    participationId.value = participation.documentId
    value.value = participation.notification
  }
	isInitialized.value = true
}

// Speichern bei Änderung
watch(value, async (newVal, oldVal) => {
	console.log(newVal, oldVal)
	if(user?.value?.role?.name === 'Workshop') return
  if (!participationId.value || !isInitialized.value ) {
		value.value = oldVal
		isDrawerOpen.value = true
		console.log(oldVal)
	}
  try {
    await update<Participation>('participations', participationId.value, {
      notification: newVal
    })
		isDrawerOpen.value = false
  } catch (err) {
    console.error('Fehler beim Speichern der Benachrichtigung:', err)
  }
})

watch(
		() => user.value?.id,
		async (newId, oldId) => {
			if (newId && newId !== oldId) {
					loadParticipation()
			}
		},
		{ immediate: true }
	)
</script>
