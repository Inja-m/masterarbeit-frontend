<template>
  <div class="flex flex-col h-screen">
		<HeaderTitle
      v-if="metaHeader.showHeader"
      :title="metaHeader.title"
      :show-back="metaHeader.back"
			:show-x="metaHeader.showX"
      @back="handleBack"
    />
    <main class="grow overflow-y-auto">
      <slot />
    </main>
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
	console.log(user.value.role.name)
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