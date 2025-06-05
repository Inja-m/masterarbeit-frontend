<template>
  <Section class="min-h-screen flex items-center justify-center" >
    <div class="m-4">
      <UTabs
        :items="items"
        variant="link"
        class="gap-4 w-full md:w-1/2 lg:w-1/3"
        :ui="{ trigger: 'grow' }"
      >
        <!-- Login Tab -->
        <template #login="{ item }">
          <p class="text-muted mb-4">{{ item.description }}</p>
          <LoginForm title="Melde dich mit deinem Konto an"/>
        </template>

        <!-- Workshop Tab -->
        <template #workshop="{ item }">
          <p class="text-muted mb-4">{{ item.description }}</p>
          <LoginForm title="Zugang über Workshop-Identifier" identifierLabel="Workshop-Identifier" />
        </template>
      </UTabs>
    </div>
  </Section>
</template>

<script setup lang="ts">
const items = [
  {
    label: 'Workshop ansehen',
    icon: 'i-lucide-laptop',
    slot: 'workshop' as const
  },
	{
    label: 'Login',
    icon: 'i-lucide-log-in',
    slot: 'login' as const
  }
] satisfies TabsItem[]
</script>