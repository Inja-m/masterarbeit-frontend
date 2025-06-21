<template>
  <UModal  :close="{ onClick: () => emit('close', false)}" :dismissible="false"  title="Workshop hinzufügen" :close-icon="identifier ? 'i-lucide-x' : undefined">
    <template #body>
      <UForm
        :validate="validate"
        :state="state"
        class="space-y-4 mb-4"
        @error="onError"
      >
        <UFormField  label="Workshop-Identifier" name="identifier" required @input="() => validate(state)">
          <UInput v-model="state.identifier" class="w-full" />
        </UFormField>
      </UForm>
			<AddPersonalCode v-if="workshop?.documentId" :workshopId="workshop.documentId" :required="false" @close="handleAddPersonalCodeClose" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Workshop } from '../types/Workshop'
import type { FormError, FormErrorEvent } from '@nuxt/ui'

const props = defineProps<{
  identifier?: string
}>()


const { find, create } = useStrapi()
const { fetchUser } = useStrapiAuth()
const emit = defineEmits<{ close: [boolean] }>()

const workshop = ref<Workshop | null>(null)

const state = reactive({
  identifier: props.identifier,
})


const validate = async (state: any): Promise<FormError[]> => {
  const errors = []	
		const exists = await doesIdentifierExist(state.identifier)
		if (!state.identifier) {
			errors.push({ name: 'identifier', message: 'Erforderlich' })
		} else if (!exists) {
			errors.push({ name: 'identifier', message: 'Nicht Valide' })
		} 
  return errors
}

async function onError(event: FormErrorEvent) {
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const doesIdentifierExist = async (identifier: string): Promise<boolean> => {
  if (!identifier) return false

	const res = await find<Workshop>('workshops', {
    filters: {
      identifier: state.identifier
    },
    populate: { workshop_groups: { populate: '*' } }
  })

	if(res.data?.length === 0) return false
	workshop.value = res.data[0]
	return true
}
async function handleAddPersonalCodeClose(groupId: string) {
	try {
    const user = await fetchUser()
    await create('participations', {
      user: user.value.id,
      workshop_group: groupId
    })

		emit('close', true)
  } catch (error: any) {
    console.error(
      'Fehler beim Erstellen der Participation:',
      JSON.stringify(error, null, 2)
    )
  }
}
onMounted(() => {
  if (props.identifier) {
    validate(state)
  }
})
</script>
