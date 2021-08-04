<template>
  <div class="container mx-auto">
    <component :is="view" />
  </div>
</template>

<script setup>
import useReport from '@/composables/report'
import Polls from '@/components/Polls'
import Poll from '@/components/Poll'
import { ref, markRaw, watch } from 'vue'

const view = ref(null)

const changeView = newView => {
  const lookup = { Polls, Poll }
  view.value = markRaw(lookup[newView])
}

const { initializeReport, selectedPoll } = useReport()

watch(selectedPoll, (poll = null) => changeView(poll === null ? 'Polls' : 'Poll'), { immediate: true })

const init = async () => {
  await initializeReport()
}

init()
</script>
