<template>
  <UCard class="w-full" variant="soft">
    <template #header>
      <h1 class="text-center">{{ computedTitle }}</h1>
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
      <!-- Profilname oder Identifier -->
      <UFormField :label="computedIdentifierLabel" name="identifier">
        <UInput
          v-model="state.identifier"
          :placeholder="computedIdentifierLabel"
          icon="i-lucide-user"
          required
          class="w-full"
        />
      </UFormField>

      <!-- E-Mail nur bei Registrierung -->
      <UFormField v-if="isRegister" label="E-Mail" name="email">
        <UInput
          v-model="state.email"
          placeholder="E-Mail-Adresse"
          icon="i-lucide-mail"
          class="w-full"
        />
      </UFormField>

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
        v-if="isRegister"
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
      <div class="flex justify-end gap-8">
        <div v-if="!isRegister && title !== 'Workshop Anzeigen'" class="text-center text-sm mt-4">
          <UButton
            variant="link"
            color="primary"
            class="px-0"
            @click="openForgotPasswordModal"
          >
            Passwort vergessen?
          </UButton>
        </div>

        <div class="flex pt-4">
          <UButton type="submit">{{ computedButtonText }}</UButton>
        </div>
      </div>
    </UForm>

    <template #footer>
      <p class="text-sm text-center text-gray-500 dark:text-gray-400">
        {{ isRegister ? 'Schon ein Konto?' : 'Noch kein Konto?' }}
        <UButton variant="link" @click="isRegister = !isRegister">
          {{ isRegister ? 'Einloggen' : 'Registrieren' }}
        </UButton>
      </p>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import * as v from 'valibot'
import { until } from '@vueuse/core'
import { JoinGroupModal, ForgotPasswordModal } from '#components'
import type { User } from '../types/User'
import type { FormError } from '@nuxt/ui'

const props = defineProps<{
  title?: string
  identifierLabel?: string
  isRegister?: boolean
}>()

const { login, register } = useStrapiAuth()
const { find } = useStrapi()
const route = useRoute()

const show = ref(false)
const isRegister = ref(props.isRegister ?? false)
const loginError = ref<string | null>(null)

const user = await useUserWithRole() as Ref<User | null>

const emit = defineEmits<{ close: [boolean] }>()
const overlay = useOverlay()

const openForgotPasswordModal = () => {
  const modal = overlay.create(ForgotPasswordModal)
  modal.open()
}

const computedButtonText = computed(() => {
  if (props.title === 'Workshop Anzeigen') return 'Ansehen'
  if (isRegister.value) return 'Registrieren'
  return 'Login'
})

const computedTitle = computed(() => {
  if (props.title && props.isRegister == isRegister.value) return props.title
  return isRegister.value ? 'Registrieren' : 'Anmelden'
})

const computedIdentifierLabel = computed(() => {
  if (props.identifierLabel && props.isRegister == isRegister.value)
    return props.identifierLabel
  return isRegister.value ? 'Profilname' : 'Profilname oder E-Mail'
})

const schema = computed(() => {
  if (isRegister.value) {
    return v.object({
      identifier: v.pipe(v.string(), v.minLength(2, 'Min. 2 Zeichen')),
      email: v.pipe(v.string(), v.email('Gültige E-Mail erforderlich')),
      password: v.pipe(v.string(), v.minLength(6, 'Min. 6 Zeichen')),
      confirmPassword: v.pipe(v.string(), v.minLength(6, 'Min. 6 Zeichen'))
    })
  } else {
    return v.object({
      identifier: v.pipe(v.string(), v.minLength(2, 'Min. 2 Zeichen')),
      password: v.pipe(v.string(), v.minLength(6, 'Min. 6 Zeichen'))
    })
  }
})
const validate = (state:{identifer?:string, email?: string, password?:string, confirmPassword?:string} ): FormError[] => {
  const errors = []
  if (isRegister.value && state.password !== state.confirmPassword) {
    errors.push({ name: 'confirmPassword', message: 'Nicht identisch' })
  }
  return errors
}

// Form-Zustand
const state = reactive({
  identifier: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Registrierung oder Login
const onSubmit = async () => {
  console.log('LoginForm')
  const userBeforeLogin = JSON.parse(JSON.stringify(user.value))
  try {
    emit('close', false)
    if (isRegister.value) {
      await register({
        username: state.identifier,
        email: state.email,
        password: state.password
      })
    }
    await login({
      identifier: state.identifier,
      password: state.password
    })
    await until(user).toMatch((u) => !!u?.id && u.id !== userBeforeLogin?.id)

    if (
      userBeforeLogin?.role?.name === 'Workshop' &&
      user?.value?.role?.name === 'Authenticated'
    ) {
      try {
        const workshopParticipation = await find('participations', {
          filters: { user: { id: userBeforeLogin.id } },
          populate: { workshop_group: { populate: ['workshop'] } }
        })
        const userParticipation = await find('participations', {
          filters: {
            user: { id: user?.value?.id },
            workshop_group: {
              workshop: {
                documentId: {
                  $eq: workshopParticipation.data[0].workshop_group.workshop
                    .documentId
                }
              }
            }
          },
          populate: { workshop_group: { populate: ['workshop'] }, user: true }
        })
        if (userParticipation.data.length > 0)
          return navigateTo(
            `/workshop/${workshopParticipation.data[0].workshop_group?.workshop?.documentId}`
          )
        // weitere Vorgehen anzeigen des Modals... Neuer user bzw. Participation entfernen...

        const modal = overlay.create(JoinGroupModal, {
          props: {
            identifier:
              workshopParticipation.data[0].workshop_group?.workshop?.identifier
          }
        })
        const instance = modal.open()
        const everythingRight = await instance.result

        if (everythingRight) {
          return
        }
        return
      } catch (e) {
        console.error('workshopParticipation fehlgeschlagenS', e)
      }
    }
    if (user.value?.role?.name === 'Workshop') {
      try {
        const { data } = await find('participations', {
          filters: { user: { id: { $eq: user.value.id } } },
          populate: { workshop_group: { populate: ['workshop'] } }
        })
        return navigateTo(
          `/workshop/${data[0].workshop_group?.workshop?.documentId}`
        )
      } catch (e) {
        console.error('Login Workshop', e)
      }
    }

    return navigateTo({ name: 'home' })
  } catch (e) {
    console.error('Login/Register fehlgeschlagen:', e)
    loginError.value = e.error.message
  }
}
onMounted(() => {
  const identifier = route.query.identifier as string
  const password = route.query.password as string
  if (identifier && password) {
    state.password = password
    state.identifier = identifier
    onSubmit()
  }
})
</script>
