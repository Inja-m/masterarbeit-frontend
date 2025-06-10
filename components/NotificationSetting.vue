<template>
  <UDrawer :title="title">
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
			<LoginForm v-if="user?.role?.name === 'Workshop'" :isRegister="true" />
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import { Bell, BellOff, BellRing } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  workshopId: string
}>()

const { find, update } = useStrapi()
const user = await useUserWithRole()

const value = ref<'all' | 'relevant' | 'off'>()
const participationId = ref<number | null>(null)

const isInitialized = ref(false)

onMounted(async () => {
  const res = await find<Participation>('participations', {
    filters: {
      user: { id: { $eq: user.value?.id } },
      workshop_group: { workshops: { id: { $eq: props.workshopId } } }
    }
  })

  if (res.data.length > 0) {
    const participation = res.data[0]
    participationId.value = participation.documentId
    value.value = participation.notification
  }
	  isInitialized.value = true
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
    const result = await useRegisterSubscription()
    console.log('Push-Abo erfolgreich:', result)
  } catch (error) {
    console.error('Fehler beim Registrieren der Subscription:', error)
  }
	}
  
}

// Speichern bei Änderung
watch(value, async (newVal) => {

  if (!participationId.value || !isInitialized.value ) return
  try {
    await update<Participation>('participations', participationId.value, {
      notification: newVal
    })
  } catch (err) {
    console.error('Fehler beim Speichern der Benachrichtigung:', err)
  }
})
</script>
