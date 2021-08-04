<template>
  <span v-html="output" />
</template>

<script setup>
import { defineProps, computed, toRefs, unref } from 'vue'

const props = defineProps({
  hit: { type: [String, Object], required: true },
  attribute: { type: String, required: true },
  highlightClasses: { type: String, required: false }
})

const { hit, attribute, highlightClasses } = toRefs(props)

const resolveAttribute = (obj, key) => key.split('.').reduce((prev, curr) => prev?.[curr], obj)

const matches = computed(() => typeof hit.value.item === 'string' ? hit.value.matches?.[0] : hit.value.matches?.find(m => m.key === attribute.value))
const fallback = computed(() => typeof hit.value.item === 'string' ? hit.value.item : resolveAttribute(hit.value.item, attribute.value))

const highlight = (value, indices = [], i = 1) => {
  const pair = indices[indices.length - i]
  return !pair
    ? value
    : `${highlight(value.substring(0, pair[0]), indices, i + 1)}<mark class="${highlightClasses.value}">${value.substring(pair[0], pair[1] + 1)}</mark>${value.substring(pair[1] + 1)}`
}

const output = computed(() => highlight(unref(matches)?.value || unref(fallback), unref(matches)?.indices))
</script>
