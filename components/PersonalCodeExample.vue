<template>
	 <UAlert
    color="neutral"
    variant="subtle"
    class="mb-4"
  >
    <template #title>Beispiel für die Erstellung des Codewortes</template>
    <template #description>
			Bitte beachte: <strong>Groß- und Kleinschreibung</strong> im Codewort müssen später eingehalten werden.
    	Idealerweise schreibst du es genauso wie im Beispiel. 
      <div v-if="personalCodeExample" v-html="marked(personalCodeExample)" class="pt-4" />
    </template>
  </UAlert>
</template>

<script setup lang="ts">
import { marked } from 'marked'

defineProps<{
  personalCodeExample: string
}>()

</script>