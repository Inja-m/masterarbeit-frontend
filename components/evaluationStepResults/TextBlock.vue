<template>
  <div v-if="hasAnyText" class="mt-6">
    <div v-for="res in result" :key="res.id" class="space-y-4">
      <div v-for="textgroup in res.Text" :key="textgroup.id">
				<div v-if="textgroup.text" v-html="marked(textgroup.text)" class="prose max-w-none" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
const props = defineProps<{ result: any[] }>()

const hasAnyText = computed(() =>
  props.result?.some((res) => res.Text?.some((t) => t.text?.trim()))
)
</script>