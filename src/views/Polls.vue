<template>
  <v-table
    :rows="hits"
    :columns="columns"
    :loading="loading"
    @select-poll="selectPollHandler">
    <template v-slot:table-header="{ columns }">
      <tr class="text-gray-800">
        <th class="pt-3 px-3 text-left text-sm" :colspan="columns.length">
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
              class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-leanix-dark-blue hover:bg-leanix-darkest-blue transition-colors focus:outline-none focus:ring-0">
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
import { useRouter } from 'vue-router'
import useReport from '@/composables/useReport'
import useFuse from '@/composables/useFuse'
import VTable from '@/components/Table'
import PollTitleCell from '@/components/PollTitleCell'
import { RefreshIcon } from '@heroicons/vue/outline'

const polls = ref([])
const loading = ref(false)

const router = useRouter()
const { fetchPolls, reportInitialized, formatDateAsDistanceToNow } = useReport()
const { hits, query } = useFuse(polls, { keys: ['title'], findAllMatches: true })

const defaultMapFn = (row, key) => row.item[key]

const columns = [
  {
    key: 'id',
    label: 'ID',
    mapFn: (row, key) => defaultMapFn(row, key).split('-').slice(-1)[0],
    clickHandler: ({ item }, columnKey) => { router.push({ name: 'pollRuns', params: { id: item[columnKey] } }) }
  },
  {
    key: 'title',
    label: 'Title',
    component: PollTitleCell,
    bindings: row => ({ hit: row, attribute: 'title', highlightClasses: 'text-red-600 font-semibold bg-transparent' }),
    mapFn: defaultMapFn
  },
  { key: 'openPollRunCount', label: 'Open Polls', mapFn: defaultMapFn },
  { key: 'pollRunCount', label: 'Total Polls', mapFn: defaultMapFn },
  { key: 'creationDate', label: 'Creation Date', mapFn: (row, key) => formatDateAsDistanceToNow(defaultMapFn(row, key)) },
  { key: 'status', label: 'Status', mapFn: defaultMapFn }
]

const selectPollHandler = id => router.push({ name: 'pollRuns', params: { id } })

const refreshPolls = async () => {
  try {
    loading.value = true
    polls.value = await fetchPolls()
  } catch (error) {
    console.error(error)
    polls.value = []
  } finally {
    loading.value = false
  }
}
watch(reportInitialized, initialized => { if (initialized) refreshPolls() }, { immediate: true })
</script>
