<template>
  <router-view />
</template>

<script setup>
import useReport from '@/composables/useReport'

const { initializeReport } = useReport()

initializeReport()
</script>
