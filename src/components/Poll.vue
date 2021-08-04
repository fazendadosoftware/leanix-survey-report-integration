<template>
  <v-table
    :rows="pollRuns"
    :columns="columns"
    @select-poll-run="selectHandler">
    <template v-slot:table-header="{ columns }">
      <th class="py-2 px-3 text-left text-sm" :colspan="columns.length">
        <div class="flex space-x-2">
          <button
            v-wave
            @click="selectedPoll = null"
            type="button"
            class="inline-flex items-center focus:outline-none focus:ring-0">
            <ArrowLeftIcon class="w-5" aria-hidden="true" />
          </button>
          <span class="text-xl font-semibold">{{selectedPoll.title}}</span>
        </div>
      </th>
    </template>
  </v-table>
  <pre>
    {{pollRunResults}}
  </pre>
</template>

<script setup>
import { unref, ref } from 'vue'
import { ArrowLeftIcon } from '@heroicons/vue/outline'
import useReport from '@/composables/report'
import VTable from '@/components/Table'
import PollRunStartedAtCell from '@/components/PollRunStartedAtCell'

const { selectedPoll, fetchPollRuns, fetchPollRunResults } = useReport()

const pollRuns = ref(null)
const pollRunResults = ref(null)
const loading = ref(false)

const columns = [
  { key: 'id', label: 'Poll Run ID', clickHandler: (row, columnKey) => { fetchPollRunResultsHandler(row[columnKey]) } },
  { key: 'startTime', label: 'Started at', component: PollRunStartedAtCell, bindings: ({ startTime, id }) => ({ startTime, id }) },
  { key: 'status', label: 'Status' },
  { key: 'recipients', label: 'Recipients', mapFn: ({ recipientsCompleted, recipientsTotal }) => `${recipientsCompleted} / ${recipientsTotal}` },
  { key: 'factsheets', label: 'FactSheets', mapFn: ({ factsheetsCompleted, factsheetsTotal }) => `${factsheetsCompleted} / ${factsheetsTotal}` }
]

const fetchPollRunsHandler = async () => {
  loading.value = true
  try {
    pollRuns.value = await fetchPollRuns(unref(selectedPoll).id)
  } finally {
    loading.value = false
  }
}

const fetchPollRunResultsHandler = async pollRunId => {
  loading.value = true
  try {
    pollRunResults.value = await fetchPollRunResults(pollRunId)
  } finally {
    loading.value = false
  }
}

const selectHandler = id => {
  console.log('ID', id)
}

fetchPollRunsHandler()

</script>
