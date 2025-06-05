<template>
  <UCard class="w-full" variant="soft">
    <template #header>
      <h2 class="text-center">{{ title }}</h2>
    </template>

    <UForm
      :schema="formSchema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField :label="computedLabel" name="identifier">
        <UInput
          v-model="state.identifier"
          :placeholder="computedLabel"
          icon="i-heroicons-user-circle"
          required
          class="w-full"
        />
      </UFormField>

      <UFormField label="Passwort" name="password">
        <UInput
          v-model="state.password"
          :type="show ? 'text' : 'password'"
          placeholder="Passwort"
          :ui="{ trailing: 'pe-1' }"
          class="w-full"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="show ? 'Passwort ausblenden' : 'Passwort anzeigen'"
              @click="show = !show"
            />
          </template>
        </UInput>
      </UFormField>

      <div class="flex justify-end pt-4">
        <UButton type="submit">{{ computedButtonText }}</UButton>
      </div>
    </UForm>

    <template #footer>
      <p class="text-sm text-center text-gray-500 dark:text-gray-400">
        Noch kein Konto?
      </p>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import * as v from 'valibot'

const props = defineProps<{
  title: string
  identifierLabel?: string
}>()

const show = ref(false)
const { find } = useStrapi()

// Dynamisches Label
const computedLabel = computed(
  () => props.identifierLabel?.trim() || 'E-Mail oder Profilname'
)

const computedButtonText = computed(() =>
  props.identifierLabel ? 'Ansehen' : 'Login'
)

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

const formSchema = v.object({
  identifier: v.custom((val: string) => {
    if (!props.identifierLabel) {
      // flexible Validierung
      if (isEmail(val)) {
        const result = v.safeParse(v.email(), val)
        return result.success || 'Ungültige E-Mail-Adresse'
      } else {
        return val.length >= 2 || 'Profilname zu kurz'
      }
    } else {
      return val.length >= 2 || 'Ungültige Eingabe'
    }
  }),
  password: v.pipe(v.string(), v.minLength(6, 'Mindestens 6 Zeichen'))
})

const state = reactive({
  identifier: '',
  password: ''
})

const { login } = useStrapiAuth()
const router = useRouter()

const onSubmit = async () => {
  try {
    await login({
      identifier: state.identifier,
      password: state.password
    })

		const user = await useUserWithRole()
    if (user.role.name === 'Workshop') {
      const { data } = await find('participations', {
        filters: {
          user: {
            id: { $eq: user.id }
          }
        },
        populate: {
          workshop_group: {
            populate: ['workshop']
          }
        }
      })
			router.push(`/workshop/${data[0].workshop_group?.workshop?.documentId}`)
    } else {
      router.push('/')
    }
  } catch (e) {
    console.error('Login fehlgeschlagen:', e)
  }
}
</script>
