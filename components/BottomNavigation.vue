<template>
  <nav
    class="border-t flex justify-around py-4 bg-accented"
  >
    <NuxtLink to="/" class="flex flex-col items-center text-sm">
      <Home :size=size :stroke-width="stroke" />
      <span class="text-xs pt-1">Home</span>
    </NuxtLink>

    <NuxtLink to="/notifications" class="flex flex-col items-center text-sm">
			<UChip color="neutral" :show="unreadCount > 0">
				<Bell :size=size :stroke-width="stroke" />
			</UChip>
      <span class="text-xs pt-1">Benachrichtigung</span>
    </NuxtLink>

    <NuxtLink to="/profile" class="flex flex-col items-center text-sm">
      <User :size=size :stroke-width="stroke" />
      <span class="text-xs pt-1">Profil</span>
    </NuxtLink>
  </nav>
</template>
<script setup lang="ts">
import { Home, Bell, User } from 'lucide-vue-next'
import { useNotifications } from '~/composables/userNotification'

const { unreadCount } = useNotifications()

const size = 20
const stroke = 1.5

</script>