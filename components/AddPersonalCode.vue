<template>
  <UAlert
    color="info"
    variant="subtle"
    icon="i-lucide-alert-circle"
    class="mb-4"
  >
    <template #title>Infos zum Codewort</template>
    <template #description>
      Mithilfe deines persönlichen Codewortes kannst du später die Löschung
      deiner Daten veranlassen.
    </template>
  </UAlert>
	 <UAlert
    color="neutral"
    variant="subtle"
    class="mb-4"
  >
    <template #title>Beispiel für die Erstellung des Codewortes</template>
    <template #description>
      <div v-if="workshop?.personalCodeExample" v-html="marked(workshop?.personalCodeExample)" />
    </template>
  </UAlert>
  <UForm
    :validate="validate"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
    @error="onError"
  >
	
    <UFormField v-if="workshop?.workshop_groups?.length > 1" label="Gruppen Auswahl" name="groupID">
      <USelect
        v-model="state.groupId"
        :items="workshop?.workshop_groups.map((g) => ({ label: g.name, value: g.documentId }))"
        placeholder="auswählen..."
        class="w-full"
      />
    </UFormField>
    <UFormField label="Codewort" name="personalCode">
      <UInput v-model="state.personalCode" placeholder="Personal Code" class="w-full" />
    </UFormField>
<div class="flex items-center justify-end h-full">
	<UButton :disabled="!isFormValid" type="submit"> Hinzufügen </UButton>

</div>
			
  </UForm>
</template>

<script setup lang="ts">
import type { Workshop } from '../types/Workshop'
import { marked } from 'marked'

import type { FormError, FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'

const { findOne, create } = useStrapi()
const emit = defineEmits<{ close: [boolean] }>()

const workshop = ref<Workshop>()

const props = defineProps<{
  open: boolean
  workshopId: string
}>()

const state = reactive({
  groupId: '',
  personalCode: ''
})

const isFormValid = computed(() => {
  return !!state.personalCode && !!state.groupId
})

const validate = async (state: any): Promise<FormError[]> => {
  const errors = []
  if (!state.groupId) errors.push({ name: 'groupId', message: 'Erforderlich' })
	if (!state.personalCode) errors.push({ name: 'personalCode', message: 'Erforderlich' })
		return errors
	}

async function onError(event: FormErrorEvent) {
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

async function onSubmit(_event: FormSubmitEvent<typeof state>) {
  try {
    await create('personal-codes', {
      code: state.personalCode,
      workshop_group: state.groupId
    })
    emit('close', true)
  } catch (error: any) {
    console.error(
      'Fehler beim Erstellen des personalCodes:',
      JSON.stringify(error, null, 2)
    )
  }
}

const loadWorkshopGroups = async () => {
  const res = await findOne<Workshop>('workshops', props.workshopId, {
    populate: { workshop_groups: { populate: '*' }}
  })
  workshop.value = res.data

  if ( workshop.value.workshop_groups.length === 1) {
    state.groupId = workshop.value.workshop_groups[0].documentId
  }
}
onMounted(loadWorkshopGroups)
</script>
