<template>
	<Section>
	<div
    class="flex items-center justify-center m-4"
  >
    <UCard class="w-full md:w-1/3" variant="soft">
      <template #header>
        <h2 class="text-2xl font-semibold text-center">Anmelden</h2>
      </template>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Email" name="email">
					<UInput
          v-model="state.email"
          type="email"
          placeholder="E-Mail-Adresse"
          icon="i-heroicons-envelope"
          required
					class="w-full"
        />

        </UFormField>

        <UFormField label="Password" name="password">
          <UInput
            v-model="state.password"
            placeholder="Password"
            :type="show ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
						class="w-full"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="show ? 'Hide password' : 'Show password'"
                :aria-pressed="show"
                aria-controls="password"
                @click="show = !show"
              />
            </template>
          </UInput>
        </UFormField>
				<div class="flex justify-end pt-4">
        <UButton type="submit"> Login </UButton>
				</div>
      </UForm>

      <template #footer>
        <p class="text-sm text-center text-gray-500 dark:text-gray-400">
          Noch kein Konto?
          <!--<NuxtLink to="/register" class="text-primary-600 hover:underline">
            Registrieren
          </NuxtLink>-->
        </p>
      </template>
    </UCard>
  </div>	
	</Section>
  
</template>

<script setup lang="ts">
import * as v from 'valibot'

const show = ref(false)

const schema = v.object({
  email: v.pipe(v.string(), v.email('Invalid email')),
  password: v.pipe(v.string(), v.minLength(6, 'Must be at least 8 characters'))
})


const state = reactive({
  email: '',
  password: ''
})

const { login } = useStrapiAuth()
const router = useRouter()

const onSubmit = async () => {
  try {
		await login({ identifier: state.email, password: state.password })
    router.push('/')
  } catch (e) {console.error('Fehler beim Login oder Routing:', e)}
}
</script>
