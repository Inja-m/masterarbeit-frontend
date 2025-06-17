<template>
  <div class="flex items-center justify-between bg-elevated p-4 md:p-6">
    <ChevronLeft
      v-if="showBack"
      :size="24"
      stroke-width="2"
      @click="$emit('back')"
    />
    <div class="flex-1 text-center font-medium text-lg md:text-xl">
      {{ title }}
    </div>
    <UDrawer v-if="showDrawer" v-model:open="openDrawer">
      <UButton color="neutral" variant="ghost">
        <EllipsisVertical :size="24" stroke-width="2" />
      </UButton>

      <template #content>
        <div class="p-4 flex flex-col">
          <BaseModalAction 
						v-if="user?.role?.name === 'Workshop'"
            label="Anmelden"
            icon="i-lucide-circle-user"
						@update:open="handleModalToggle"
          >
            <template #body>
              <LoginForm title="Anmelden" identifierLabel="E-Mail oder Profilname"/>
            </template>
          </BaseModalAction>
					<BaseModalAction 
						title="Codewort angeben"
            label="Personal Code"
            icon="i-lucide-key-round"
						@update:open="handleModalToggle"
          >
          <template #body>
              <AddPersonalCode :workshopId="workshopId" @close="handleModalToggle(false)" />
            </template>
          </BaseModalAction>
					<WithdrawData
            :workshopId="workshopId"
            @update:open="handleModalToggle"
          />
        </div>
      </template>
    </UDrawer>
  </div>
</template>

<script setup lang="ts">
import { EllipsisVertical, ChevronLeft } from 'lucide-vue-next'

defineProps<{
  title: string
  showBack?: string
  showX?: boolean
}>()

defineEmits(['back'])

const route = useRoute()
const user = await useUserWithRole()

const workshopId = route.params.id
const showDrawer = computed(() => route.name === 'workshop-details')
const openDrawer = ref(false)
const openModal = ref(false)

function handleModalToggle(val: boolean) {
  openModal.value = val
  if (!val) {
    // Wenn Modal geschlossen wird, Drawer schließen
    openDrawer.value = false
  }
}
</script>
