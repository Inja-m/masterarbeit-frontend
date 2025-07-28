<template>
 <Section>
    <div v-if="notifications.length === 0">
      Keine Benachrichtigungen
    </div>
    <div v-else class="flex flex-col gap-2 mt-4">
      <div v-for="n in notifications" :key="n.id" @click="() => clicked(n)">
				<UCard v-if="n.notification" :variant="n.read ? 'soft' : 'solid'"  >
					<p class="text-xs font-semibold text-muted mb-1">{{ n.notification?.workshop_groups[0]?.workshop.workshop_serie.name}}  • {{formatRelativeTime(n.createdAt)}}</p>
					<h2>{{n.notification.title}}</h2>
					{{n.notification.message}}
      	</UCard>
      </div>
    </div>
  </Section>
</template>

<script setup lang="ts">
import type { UserNotification } from '~/types/UserNotification'
import { useNotifications } from '~/composables/userNotification'

useHead({
  title: 'CoTrack'
})
definePageMeta({
	header: {
    title: 'Benachrichtigungen',
    back: false,
    showHeader: true
  }
})

const { notifications, markAsRead } = useNotifications()

const router = useRouter()
async function clicked(n: UserNotification) {
  await markAsRead(n)
  const docId = n.notification?.workshop_groups[0]?.workshop?.documentId
  if (docId) {
    router.push(`/workshop/${docId}`)
  }
}

</script>
