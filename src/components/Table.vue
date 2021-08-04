<template>
  <table class="min-w-full divide-y divide-gray-200 border-r border-l border-b">
    <thead class="bg-leanix-blue text-white sticky top-0">
      <slot name="table-header" :columns="columns" />
      <tr>
        <th
          v-for="column in columns"
          :key="column.key"
          scope="col"
          class="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
          {{column.label}}
        </th>
      </tr>
    </thead>
    <transition-group
      tag="tbody"
      move-class="transition-transform duration-300">
      <template v-if="Array.isArray(rows)">
        <tr
          v-for="(row, idx) in rows"
          :key="idx"
          class="hover:bg-gray-300 transition-colors"
          :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-200'">
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900"
            :class="column.classes">
            <component
              v-if="column.component"
              :is="column.component"
              v-bind="typeof column.bindings === 'function' ? column.bindings(row) : row" />
            <span
              v-else
              v-text="typeof column.mapFn === 'function' ? column.mapFn(row, column.key) : row[column.key]"
              :class="{
                'text-leanix-blue hover:underline cursor-pointer': typeof column.clickHandler === 'function'
              }"
              @click.stop="callColumnClickHandler(row, column)"/>
          </td>
        </tr>
      </template>
      <slot v-if="!loading && rows !== null && rows.length === 0" name="no-rows">
        <tr>
          <td class="px-3 py-2 text-gray-600 text-xs text-center" :colspan="columns.length">
            No results...
          </td>
        </tr>
      </slot>
    </transition-group>
  </table>
</template>

<script setup>
import { defineProps, toRefs } from 'vue'

const props = defineProps({
  rows: { required: true, default: null },
  columns: { type: Array, required: true },
  loading: { type: Boolean }
})

const { rows, columns } = toRefs(props)

const callColumnClickHandler = (row, column) => typeof column?.clickHandler === 'function'
  ? column.clickHandler(JSON.parse(JSON.stringify(row)), column.key)
  : undefined

</script>
