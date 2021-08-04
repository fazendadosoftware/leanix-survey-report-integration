<template>
  <div
    @click="onClick"
    class="cursor-pointer hover:underline text-leanix-blue">
    <fuse-highlight :hit="hit" :attribute="attribute" :highlightClasses="highlightClasses" />
  </div>
</template>

<script setup>
import useReport from '@/composables/report'
import FuseHighlight from '@/components/FuseHighlight'
import { defineProps, toRefs, unref } from 'vue'

const props = defineProps({
  hit: { type: [String, Object], required: true },
  attribute: { type: String, required: true },
  highlightClasses: { type: String, required: false }
})

const { hit, attribute, highlightClasses } = toRefs(props)
const { selectedPoll } = useReport()

const onClick = () => {
  const { item } = unref(hit)
  selectedPoll.value = JSON.parse(JSON.stringify(item))
}
</script>
