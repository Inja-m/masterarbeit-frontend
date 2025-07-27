import { ref, computed } from 'vue'
import { useStrapi } from '#imports'
import type { UserNotification } from '~/types/UserNotification'
import type { User } from '../types/User'

const notifications = ref<UserNotification[]>([])

export function useNotifications() {
	onMounted(() => {
  fetchNotifications()
	if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', () => {
			fetchNotifications()
    })
  }
})
  const { find, update } = useStrapi()
	const { fetchUser } = useStrapiAuth()

  const fetchNotifications = async () => {
		const user = await useStrapiUser() as Ref<User>
		  if (!user.value) {
    try {
      await fetchUser()
    } catch (e) {
			console.error(e)
      // Bei SSR: Kein Cookie oder ungültiges Token → kein User
    }
  }
    const { data } = await find<UserNotification>('user-notifications', {
      filters: { user: { id: { $eq: user.value.id } } },
			sort: ['createdAt:desc'],
      populate: {
        notification: {
          populate: {
            workshop_groups: {
              populate: {
                workshop: {
                  populate: ['workshop_serie']
                }
              }
            }
          }
        }
      }
    })
    notifications.value = data
  }

  const markAsRead = async (notification: UserNotification) => {
    if (!notification.read) {
      await update('user-notifications', notification.documentId, { read: true })
      notification.read = true
    }
  }

  const unreadCount = computed(() =>
    notifications.value.filter(n => !n.read).length
  )

  return {
    notifications,
    fetchNotifications,
    markAsRead,
    unreadCount
  }
}