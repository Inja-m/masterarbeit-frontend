<template>
 <Section>
    <h1>Benachrichtigungen</h1>
    <div v-if="userNotifications.length === 0">
      Keine Benachrichtigungen
    </div>
    <div v-else class="flex flex-col gap-2">
      <div v-for="n in userNotifications" :key="n.id" @click="() => markAsRead(n)">
				{{ n }}
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

const { find, update} = useStrapi()
const user = await useStrapiUser()
const userNotifications = ref<UserNotification[]>([])

const router = useRouter()
async function markAsRead(n: UserNotification) { 
	console.log(n)
  if (!n.read) {
    await update('user-notifications', n.documentId, { read: true })
    n.read = true // Optimistisches Update, um reaktives Verhalten sofort zu zeigen
		 const docId = n.notification?.workshop_groups[0]?.workshop?.documentId
  if (docId) {
    router.push(`/workshop/${docId}`)
  }
  }
}

const loadNotifications = async () => {
  try {
    const response = await find<UserNotification>('user-notifications', {
      filters: {
        user: {
          id: {
            $eq: user.value.id
          }
        }
      },
      populate: {
				notification: {
					populate: {
						workshop_groups: {
							populate:{
								workshop:{
									populate:['workshop_serie']
								}
							}
						}
					}
				}
			}
    })

    userNotifications.value = response.data // .data, nicht das ganze Objekt
  } catch (error) {
    console.error('Fehler beim Laden der Benachrichtigungen:', error)
  }
}

onMounted(loadNotifications)
</script>
