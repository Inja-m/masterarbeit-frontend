<template>
  <Section class="min-h-screen flex items-center justify-center" >
      <UTabs
        :items="items"
        variant="link"
        class="gap-4 w-full md:w-1/2 lg:w-1/3"
        :ui="{ trigger: 'grow' }"
      >
        <!-- Login Tab -->
        <template #login="{ item }">
          <LoginForm title="Anmelden" identifierLabel="E-Mail oder Profilname"/>
					<p class="text-center text-muted mt-4">{{ item.description }}</p>
        </template>

        <!-- Workshop Tab -->
        <template #workshop="{ item }">
          <LoginForm title="Workshop Anzeigen" identifierLabel="Workshop-Identifier" />
					<p class="text-center text-muted mt-4">{{ item.description }}</p>
        </template>
      </UTabs>
  </Section>
</template>

<script setup lang="ts">
const items = [
  {
    label: 'Workshop ansehen',
    icon: 'i-lucide-laptop',
		description: 'Zugang über Workshop-Identifier',
    slot: 'workshop' as const
  },
	{
    label: 'Login',
    icon: 'i-lucide-log-in',
		description: 'Melde dich in deinem Konto an',
    slot: 'login' as const
  }
] satisfies TabsItem[]
</script>