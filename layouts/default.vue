<template>
  <div class="flex flex-col h-screen">
    <HeaderTitle
      v-if="metaHeader.showHeader"
      :title="metaHeader.title"
      :show-back="metaHeader.back"
      :show-x="metaHeader.showX"
      @back="handleBack"
    />
    <div class="grow overflow-y-auto flex flex-col justify-between">
      <main>
        <slot />
      </main>
      <footer v-if="!isPathNavigation() || isWorkshopRole || isPathProfile()" class="flex items-end text-center text-xs text-gray-500 py-3">
        <UContainer class="flex flex-wrap items-end justify-center gap-4">
          <NuxtLink to="/datenschutz" class="hover:underline"
            >Datenschutz</NuxtLink
          >
          <NuxtLink to="/impressum" class="hover:underline">Impressum</NuxtLink>
        </UContainer>
      </footer>
    </div>

    <BottomNavigation v-if="isPathNavigation() && !isWorkshopRole" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()

function isPathNavigation () {
if(route.path === '/login'||route.path === '/impressum' ||route.path === '/datenschutz') return false
return true
}

function isPathProfile () {
if(route.path === '/profile') return true
return false
}


const user = await useUserWithRole()
const { find } = useStrapi()

const isWorkshopRole = computed(() => {
  return user?.value?.role?.name === 'Workshop'
})

const metaHeader = computed(() => {
  const meta = route.meta?.header || {}
  return {
    title: meta.title ?? '',
    back: meta.back ?? false,
    showHeader: meta.showHeader ?? false,
    showX: meta.showX ?? false
  }
})

async function handleBack() {
	console.log(user)
  if (window.history.length > 1) {
    router.back()
  } else if (user?.value?.role?.name === 'Workshop') {
    const workshopParticipation = await find('participations', {
      filters: { user: { id: user.value.id } },
      populate: { workshop_group: { populate: ['workshop'] } }
    })
    navigateTo(
      `/workshop/${workshopParticipation.data[0].workshop_group?.workshop?.documentId}`
    )
  } else {
    router.push('/')
  }
}
</script>
