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
      <footer class="flex items-end text-center text-xs text-gray-500 py-3">
        <UContainer class="flex flex-wrap items-end justify-center gap-4">
          <NuxtLink to="/datenschutz" class="hover:underline"
            >Datenschutz</NuxtLink
          >
          <NuxtLink to="/impressum" class="hover:underline">Impressum</NuxtLink>
        </UContainer>
      </footer>
    </div>

    <BottomNavigation v-if="!isLoginPage && !isWorkshopRole" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isLoginPage = computed(() => route.path === '/login')
const user = await useUserWithRole()

const isWorkshopRole = computed(() => {
  return user.value.role.name === 'Workshop'
})

const metaHeader = computed(() => {
  const meta = route.meta?.header || {}
  return {
    title: meta.title ?? '',
    back: meta.back ?? null,
    showHeader: meta.showHeader ?? false,
    showX: meta.showX ?? false
  }
})

function handleBack() {
  router.push(metaHeader.value.back)
}
</script>
