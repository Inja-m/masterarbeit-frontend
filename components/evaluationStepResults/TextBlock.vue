<template>
  <div v-if="hasTotalityText" class="mt-6">
    <div v-for="res in result" :key="res.id" class="space-y-4">
      <div v-for="textgroup in res.Text" :key="textgroup.id">
				<div v-if="textgroup.text" v-html="marked(textgroup.text)" class="prose max-w-none" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import type { WorkshopResultBlock } from '~/types/Components'
const props = defineProps<{ result: WorkshopResultBlock[] }>()

const hasTotalityText = props.result.some(item =>
  item.__component === 'media.totality' &&
  Array.isArray(item.Text) &&
  item.Text.length > 0
)
console.log(hasTotalityText)
</script>