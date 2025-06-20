<template>
	 <UAlert
    color="neutral"
    variant="subtle"
    class="mb-4"
  >
    <template #title>Beispiel für die Erstellung des Codewortes</template>
    <template #description>
      <div v-if="personalCodeExample" v-html="marked(personalCodeExample)" />
    </template>
  </UAlert>
</template>

<script setup lang="ts">
import { marked } from 'marked'

defineProps<{
  personalCodeExample: string
}>()

</script>