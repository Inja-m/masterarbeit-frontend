<template>
	<Section>
<div class="flex justify-end">
    <UButton label="Hinzufügen" color="neutral" variant="subtle" @click="open" />
  </div>
  <div v-for="workshop in userWorkshops" :key="workshop.id" class="mt-6">
    <NuxtLink :to="`/workshop/${workshop.documentId}`" class="block">
      <UCard variant="soft">
        <template #header>
          <h1>
            {{ workshop.workshop_serie.name }}
          </h1>
        </template>
        <UBadge size="sm" :style="{ backgroundColor: workshop.workshop_serie.project.color}" class="dark mb-2" >{{
          workshop.workshop_serie.project.name
        }}</UBadge>
        <IconText :icon="Calendar" :text="formatDate(workshop.date)" />
        <IconText :icon="MapPin" :text="workshop.location.name" />
        <div v-if="workshop.reward">
          <IconText :icon="HandCoins" :text="workshop.reward" />
        </div>
        <!--{{ workshop.workshop_serie.description.slice(0, 50) }}...-->
      </UCard>
    </NuxtLink>
  </div>
	</Section>
  
</template>

<script setup lang="ts">
import { Calendar, MapPin, HandCoins } from 'lucide-vue-next'
import type { Participation } from '~/types/Participation'
import type { Workshop } from '~/types/Workshop'
import type { User } from '../types/User'
import { JoinGroupModal } from '#components'

useHead({
  title: 'CoTrack'
})
definePageMeta({
  name: 'home',
	header: {
    title: 'Teilgenommene Workshops',
    back: false,
    showHeader: true
  }
})

const overlay = useOverlay()

const modal = overlay.create(JoinGroupModal)

async function open() {
  const instance = modal.open()
  const everythingRight = await instance.result

  if (everythingRight) {
    return
  }
}

const { fetchUser } = useStrapiAuth()
const { find } = useStrapi()

const userWorkshops = ref<Workshop[]>([])

const fetchUserWorkshops = async () => {
  try {
    const user = await fetchUser() as Ref<User | null>
		
    const response = await find<Participation>('participations', {
      filters: {
        user: {
          id: {
            $eq: user.value.id
          }
        }
      },
      populate: {
        workshop_group: {
          populate: {
            workshop: {
              populate: {
                workshop_serie: {
                  populate: ['project'] 
                },
								location: { populate: '*' },
              }
            }
          }
        }
      }
    })
    const allWorkshops = response.data
      .map((participation) => participation.workshop_group?.workshop)
      .filter(Boolean) 
			
    // Doppelte anhand der ID entfernen
    const uniqueWorkshops = Array.from(
      new Map(allWorkshops.map((ws) => [ws.id, ws])).values()
    )
    userWorkshops.value = uniqueWorkshops
  } catch (error) {
    console.error('Fehler beim Laden der User-Workshops:', error)
  }
}

onMounted(fetchUserWorkshops)
</script>
