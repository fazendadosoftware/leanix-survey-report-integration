<template>
  <div class="container mx-auto flex flex-col space-y-4">
    <breadcrumbs />
    <router-view/>
  </div>
</template>

<script setup>
import Breadcrumbs from '@/components/Breadcrumbs'
</script>
