<template>
  <v-table
    :rows="hits"
    :columns="columns"
    :loading="loading">
    <template v-slot:table-header="{ columns }">
      <tr class="text-gray-800">
        <th class="py-2 px-3 text-left text-sm" :colspan="columns.length">
          <div class="flex space-x-2">
            <span class="text-white text-xl font-semibold">Polls</span>
            <div class="flex-1"/>
            <input
                v-model="query"
                type="text"
                class="text-gray-700 shadow-sm focus:ring-0 focus:border-none block w-1/4 sm:text-xs border-gray-300 rounded"
                placeholder="Search polls"
              />
            <button
              v-wave
              @click="refreshPolls"
              :disabled="loading"
              type="button"
              class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm bg-white focus:outline-none focus:ring-0">
              <RefreshIcon
                class="w-4 transform rotate-180"
                :class="{
                  'animate-spin': loading
                }"
              aria-hidden="true" />
            </button>
          </div>
        </th>
      </tr>
    </template>
  </v-table>
</template>

<script setup>
import { ref, watch } from 'vue'
import useReport from '@/composables/report'
import useFuse from '@/composables/useFuse'
import VTable from '@/components/Table'
import PollTitleCell from '@/components/PollTitleCell'
import { RefreshIcon } from '@heroicons/vue/outline'

const defaultMapFn = (row, key) => row.item[key]

const columns = [
  {
    key: 'title',
    label: 'Title',
    component: PollTitleCell,
    bindings: row => ({ hit: row, attribute: 'title', highlightClasses: 'text-red-600 font-semibold bg-transparent' }),
    mapFn: defaultMapFn
  },
  { key: 'openPollRunCount', label: 'Open Polls', mapFn: defaultMapFn },
  { key: 'pollRunCount', label: 'Total Polls', mapFn: defaultMapFn },
  { key: 'creationDate', label: 'Creation Date', mapFn: defaultMapFn },
  { key: 'status', label: 'Status', mapFn: defaultMapFn }
]

const { polls, fetchPolls, reportInitialized } = useReport()
const { hits, query } = useFuse(polls, { keys: ['title'], findAllMatches: true })
const loading = ref(false)

const refreshPolls = async () => {
  try {
    loading.value = true
    await fetchPolls()
  } finally {
    loading.value = false
  }
}
watch(reportInitialized, initialized => { if (initialized) refreshPolls() })
</script>
