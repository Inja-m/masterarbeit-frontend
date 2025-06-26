<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-opacity-50 z-[1000] flex items-end justify-center"
  >
    <UCard>
      <template #header> 🍪 Cookie-Einstellungen </template>

      <p class="mb-4 text-sm text-gray-400">
        Wir verwenden Cookies, die für den sicheren Betrieb der Website
        notwendig sind, etwa für das Session-Management. Darüber hinaus möchten
        wir zusätzliche Cookies (Clarity) einsetzen, um das verhalten der
        Nutzenden besser zu verstehen, unsere Website weiterzuentwickeln und
        fundierte Aussagen im Rahmen einer wissenschaftlichen Untersuchung
        treffen zu können.
      </p>

      <div v-if="settingsOpen" class="space-y-2">
        <USwitch
          label="Essenzielle Cookies (immer aktiv)"
          :model-value="true"
          disabled
        />
        <USwitch label="Statistik - Clarity" v-model="categories.clarity" />
      </div>

      <div v-else class="flex justify-end gap-2">
        <UButton @click="() => (settingsOpen = true)" variant="ghost"
          >Einstellungen anpassen</UButton
        >
        <UButton @click="acceptClarity" color="primary"
          >Alle akzeptieren</UButton
        >
      </div>

      <div v-if="settingsOpen" class="flex justify-end mt-4">
        <UButton @click="saveConsent" color="primary"
          >Auswahl speichern</UButton
        >
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { initClarity } from '~/utils/initClarity'
const open = ref(true)

const { acceptClarity, essential, status } = useConsentManager()

defineShortcuts({
  o: () => (open.value = !open.value)
})

const show = ref(false)
const settingsOpen = ref(false)

watch(status, () => {
	console.log(status)
	if(status.value ===  'idle'){
		show.value = true
	}else{
		show.value = false
	}  
},{ immediate: true })
const categories = ref({
  essential: true, // immer true
  clarity: false
})
function saveConsent() {
  if (categories.value.clarity) {
    acceptClarity()
  }else{
		essential()
	}
}
onMounted(() => {
  if (status.value ===  'consent') {
    initClarity()
  }
})
</script>
