<template>
  <div
    class="cursor-pointer hover:underline text-leanix-blue"
    @click="emitSelectEvent">
    {{startTime}}
  </div>
</template>

<script setup>
import { toRefs, defineProps, getCurrentInstance, unref } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  startTime: { type: String, required: true }
})

const { id, startTime } = toRefs(props)

const { parent: { parent: { emit } } } = getCurrentInstance()

const emitSelectEvent = () => emit('selectPollRun', unref(id))
</script>
