<template>
  <div
    @click="onClick"
    class="cursor-pointer hover:underline text-leanix-blue">
    <fuse-highlight :hit="hit" :attribute="attribute" :highlightClasses="highlightClasses" />
  </div>
</template>

<script setup>
import FuseHighlight from '@/components/FuseHighlight'
import { defineProps, toRefs, unref, getCurrentInstance } from 'vue'

const props = defineProps({
  hit: { type: [String, Object], required: true },
  attribute: { type: String, required: true },
  highlightClasses: { type: String, required: false }
})

const { hit, attribute, highlightClasses } = toRefs(props)

const { parent: { parent: { emit } } } = getCurrentInstance()

const onClick = () => {
  const { item: { id } } = unref(hit)
  emit('select-poll', id)
}
</script>
