<template>
  <Section>
    <h1 class="mb-2">Neuigkeiten</h1>
    <div v-if="userNotifications.length === 0">Keine Benachrichtigungen</div>
    <div
      v-else
      class="flex flex-col gap-2"
    >
		<div v-for="n in userNotifications" :key="n.id">
			<NuxtLink
      :to="`/workshop/${n.workshop_groups[0].workshop.documentId}`"
      class="block"
    >
      <UAlert
        color="neutral"
        variant="subtle"
        :title="n.title "
        :description=" n.message"
      />
			</NuxtLink>
			</div>
    </div>
  </Section>
</template>

<script setup lang="ts">
import type { Notification } from '~/types/Notification'

const { find } = useStrapi()
const user = await useStrapiUser()

const userNotifications = ref<Notification[]>([])
const { data: participations } = await find('participations', {
  filters: {
    user: { id: { $eq: user.value.id } }
  },
  populate: ['workshop_group']
})

const groupIds = Array.isArray(participations?.data)
  ? participations.data
      .map((p) => p.attributes?.workshop_group?.data?.documents.id)
      .filter(Boolean)
  : []

const loadNotifications = async () => {
  try {
    const notifications = await find<Notification>('notifications', {
      filters: {
        workshop_groups: {
          id: {
            $in: groupIds
          }
        }
      },
       populate: {
    workshop_groups: {
      populate: ['workshop']
    }
  },
      sort: ['createdAt:desc']
    })

    userNotifications.value = notifications.data
  } catch (error) {
    console.error('Fehler beim Laden der User-Workshops:', error)
  }
}
onMounted(loadNotifications)
</script>
