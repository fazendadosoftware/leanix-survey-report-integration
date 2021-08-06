<template>
  <v-table
    :rows="pollRuns"
    :columns="columns"
    @select-poll-run="selectHandler">
    <template v-slot:table-header="{ columns }">
      <th class="pt-3 px-3 text-left text-sm" :colspan="columns.length">
        <div class="flex space-x-2">
          <button
            v-wave
            @click="router.go(-1)"
            type="button"
            class="inline-flex items-center focus:outline-none focus:ring-0">
            <ArrowLeftIcon class="w-4" aria-hidden="true" />
          </button>
          <span v-if="loadingPoll" class="w-1/4 text-transparent text-xl bg-leanix-dark-blue rounded animate-pulse">
            .
          </span>
          <transition
            mode="out-in"
            enter-from-class="opacity-0"
            enter-active-class="transition-opacity duration-500"
            enter-to-class="opacity-100"
            leave-from-class="opacity-100"
            leave-active-class="transition-opacity duration-500"
            leave-to-class="opacity-0">
            <span v-if="!loadingPoll" class="text-white text-xl font-axiforma-bold tracking-wider">{{poll?.title}}</span>
          </transition>
        </div>
      </th>
    </template>
  </v-table>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useReport from '@/composables/useReport'
import VTable from '@/components/Table'
import { ArrowLeftIcon } from '@heroicons/vue/solid'

const router = useRouter()
const route = useRoute()
const { fetchPoll, fetchPollRuns, formatDateAsDistanceToNow } = useReport()

const { params: { id } } = route

const poll = ref(null)
const pollRuns = ref(null)
const loadingPoll = ref(false)
const loadingPollRuns = ref(false)

const columns = [
  {
    key: 'id',
    label: 'Poll Run ID',
    clickHandler: (row, column) => { router.push({ name: 'pollRunResults', params: { id: row[column] } }) },
    mapFn: (row, columnKey) => `${row[columnKey].split('-').slice(-1)[0]}`
  },
  { key: 'status', label: 'Status' },
  { key: 'startTime', label: 'Started', mapFn: (row, key) => typeof row[key] === 'string' ? formatDateAsDistanceToNow(row[key]) : '✘' },
  { key: 'endTime', label: 'Ended', mapFn: (row, key) => typeof row[key] === 'string' ? formatDateAsDistanceToNow(row[key]) : '✘' },
  { key: 'language', label: 'Language' },
  { key: 'recipients', label: 'Recipients', mapFn: ({ recipientsCompleted, recipientsTotal }) => `${recipientsCompleted} / ${recipientsTotal}` },
  { key: 'factsheets', label: 'FactSheets', mapFn: ({ factsheetsCompleted, factsheetsTotal }) => `${factsheetsCompleted} / ${factsheetsTotal}` }
]

const init = () => {
  loadingPoll.value = true
  loadingPollRuns.value = true
  fetchPoll(id).then(_poll => { poll.value = _poll }).finally(() => { loadingPoll.value = false })
  fetchPollRuns(id).then(_pollRuns => { pollRuns.value = _pollRuns }).finally(() => { loadingPollRuns.value = false })
}

init()

</script>
