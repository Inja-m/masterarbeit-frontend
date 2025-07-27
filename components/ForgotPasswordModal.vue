<!-- components/ForgotPasswordModal.vue -->
<template>
  <UModal v-model:open="internalOpen" title="Passwort zurücksetzen">
    <template #body>
      <p class="mb-4 text-muted">
        Gib deine E-Mail-Adresse ein. Wir senden dir einen Link zum Zurücksetzen des Passworts.
      </p>

      <UForm :validate="validate" :schema="schema" :state="state" @submit="submit" class="space-y-4">

			<UFormField  label="E-Mail" name="email">
				<UInput v-model="state.email" placeholder="E-Mail-Adresse" icon="i-lucide-mail" class="w-full" />
			</UFormField>

        <div class="text-right">
          <UButton type="submit" :loading="loading">Senden</UButton>
        </div>

        <div v-if="successMessage" class="text-success text-sm">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="text-error text-sm">
          {{ errorMessage }}
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import * as v from 'valibot'
import type { FormError } from '@nuxt/ui'

const { forgotPassword } = useStrapiAuth()

const props = defineProps<{ open?: boolean }>()
const internalOpen = ref(props.open ?? true)
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const schema = computed(() => {
		return v.object({
			email: v.pipe(v.string(), v.email('Gültige E-Mail erforderlich'))
		})
})

const validate = async (state:Partial<{ email: string }>): Promise<FormError[]> => {
  const errors = []	
		if (!state.email) {
			errors.push({ name: 'identifier', message: 'Erforderlich' })
		}
  return errors
}

// Form-Zustand
const state = reactive({
	email: ''
})

// Beispiel: Strapi API verwenden
const submit = async () => {
	console.log('Mail:'+ state.email)
   try {
     const response = await forgotPassword({ email: state.email })
  console.log('Response:', response)
    successMessage.value = 'Wenn deine E-Mail bei uns registriert ist, haben wir dir eine Nachricht gesendet.'
  } catch (e: any) {
    errorMessage.value = e?.data?.error?.message ?? 'Fehler beim Zurücksetzen.'
  } finally {
    loading.value = false
  }
}
</script>