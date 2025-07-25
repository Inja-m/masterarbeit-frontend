<template>
	<Section class="min-h-svh flex items-center justify-center">
  <UCard class="w-full" variant="soft">
    <template #header>
      <h1 class="text-center">Passwort zurücksetzen</h1>
    </template>

		<UForm
      :validate="validate"
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <div v-if="loginError" class="text-error text-sm">
        {{ loginError }}
      </div>
    
      <!-- Passwort -->
      <UFormField label="Passwort" name="password">
        <UInput
          v-model="state.password"
          :type="show ? 'text' : 'password'"
          placeholder="Passwort"
          icon="i-lucide-lock"
          :ui="{ trailing: 'pe-1' }"
          class="w-full"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="show ? 'Passwort ausblenden' : 'Passwort anzeigen'"
              @click="show = !show"
            />
          </template>
        </UInput>
      </UFormField>

      <!-- Passwort bestätigen -->
      <UFormField
        label="Passwort wiederholen"
        name="confirmPassword"
      >
        <UInput
          v-model="state.confirmPassword"
          :type="show ? 'text' : 'password'"
          placeholder="Passwort bestätigen"
          icon="i-lucide-shield"
          class="w-full"
        />
      </UFormField>
        <div class="flex pt-4 justify-end">
          <UButton type="submit">Zurücksetzen</UButton>
        </div>

    </UForm>
  </UCard>
	</Section>
</template>

<script setup lang="ts">
import * as v from 'valibot'
import { until } from '@vueuse/core'

const { resetPassword } = useStrapiAuth()
const route = useRoute()

const code = ref('')
const show = ref(false)
const loginError = ref<string | null>(null)

const user = await useUserWithRole()

const schema = computed(() => {
    return v.object({
      password: v.pipe(v.string(), v.minLength(6, 'Min. 6 Zeichen')),
      confirmPassword: v.pipe(v.string(), v.minLength(6, 'Min. 6 Zeichen'))
    })
})
const validate = (state: any): FormError[] => {
  const errors = []
  if (state.password !== state.confirmPassword) {
    errors.push({ name: 'confirmPassword', message: 'Nicht identisch' })
  }
  return errors
}

// Form-Zustand
const state = reactive({
  password: '',
  confirmPassword: ''
})

// Registrierung oder Login
const onSubmit = async () => {
  console.log('LoginForm')
  const userBeforeLogin = JSON.parse(JSON.stringify(user.value))
  try {
 		await resetPassword({ code: code.value, password: state.password, passwordConfirmation: state.confirmPassword })
    await until(user).toMatch((u) => !!u?.id && u.id !== userBeforeLogin?.id)

    return navigateTo({ name: 'home' })
  } catch (e) {
    console.error('Login/Register fehlgeschlagen:', e)
    loginError.value = e.error.message
  }
}

onMounted(() => {
  code.value = route.query.code as string
})
</script>
