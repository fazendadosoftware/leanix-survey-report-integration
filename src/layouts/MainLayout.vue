<template>
  <div class="container mx-auto flex flex-col space-y-4">
    <breadcrumbs v-if="false"/>
    <router-view/>
  </div>
</template>

<script setup>
import Breadcrumbs from '@/components/Breadcrumbs'
</script>
