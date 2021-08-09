<template>
  <!--
  <div>
    <div class="cursor-pointer hover:underline" @click="router.go(-1)">BACK</div>
    <div>{{id}}</div>
    <pre v-if="columns" class="bg-red-200">{{columns}}</pre>
    <pre class="bg-blue-400" v-if="rows">{{rows}}</pre>
    <pre v-if="poll" class="bg-red-100">{{poll.title}} {{poll.status}}</pre>
    <pre v-if="pollRunSummary" class="bg-yellow-100">{{pollRunSummary.startTime}}</pre>
  </div>
  -->
  <v-table
    :key-attr="'id'"
    :rows="rows"
    :columns="columns"
    :loading="loading">
    <template v-slot:table-header="{ columns }">
      <th class="py-3 px-3 text-left text-sm" :colspan="columns.length">
        <div class="flex space-x-2">
          <button
            v-wave
            @click="router.go(-1)"
            type="button"
            class="inline-flex items-center focus:outline-none focus:ring-0">
            <ArrowLeftIcon class="w-4" aria-hidden="true" />
          </button>
          <span v-if="!poll" class="text-white text-xl font-axiforma-bold tracking-wider rounded animate-pulse px-2">
            Loading Poll Run Results #{{pollRunId.split('-').slice(-1)[0]}}
          </span>
          <transition
            mode="out-in"
            enter-from-class="opacity-0"
            enter-active-class="transition-opacity duration-500"
            enter-to-class="opacity-100"
            leave-from-class="opacity-100"
            leave-active-class="transition-opacity duration-500"
            leave-to-class="opacity-0">
            <span v-if="poll" class="text-white text-xl font-axiforma-bold tracking-wider">{{poll?.title}}</span>
          </transition>
        </div>
      </th>
    </template>
  </v-table>
</template>

<script setup>
import { ref, unref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useReport from '@/composables/useReport'
import VTable from '@/components/Table'
import { ArrowLeftIcon } from '@heroicons/vue/solid'

const route = useRoute()
const router = useRouter()
const { fetchPollRun, fetchPollRunResults, openFactSheetOnSidePane } = useReport()

const loadingPollRun = ref(false)
const loadingResults = ref(false)
const pollRun = ref(null)
const pollRunResults = ref(null)
let { params: { pollRunId, poll: routePoll } } = route

routePoll = JSON.parse(routePoll)

// const pollQuestionnaire = computed(() => unref(pollRun) !== null ? unref(pollRun).poll.questionnaire : null)
const poll = computed(() => {
  if (routePoll === null && unref(pollRun) === null) return null
  const { id, title, creationDate, status, factSheetQuery } = unref(pollRun)?.poll || routePoll || {}
  return { id, title, creationDate, status, factSheetQuery }
})

/*
const pollRunSummary = computed(() => {
  if (unref(pollRun) === null) return null
  const { id, language, startTime, endTime, status, recipientsCompleted, recipientsTotal, factsheetsCompleted, factsheetsTotal } = unref(pollRun) || {}
  return { id, language, startTime, endTime, status, recipientsCompleted, recipientsTotal, factsheetsCompleted, factsheetsTotal }
})
*/

const pollQuestions = computed(() => {
  if (unref(pollRun) === null) return null
  const pollQuestions = (unref(pollRun)?.poll?.questionnaire?.questions || [])
    .map(({ id, type, label }) => ({ id, type, label }))
  return pollQuestions
})

const columns = computed(() => {
  if (unref(pollQuestions) === null) return []
  const columns = [
    { id: 'factSheet', label: 'FactSheet', mapFn: ({ factSheet: { id, type, name } }) => `${type} / ${name}`, clickHandler: (row, columnKey) => openFactSheetOnSidePane(row[columnKey]) },
    { id: 'sender', label: 'Sender', mapFn: ({ sender: { id, email, fullName } }) => email },
    ...unref(pollQuestions)
      .filter(({ type }) => ['factsheet'].indexOf(type) < 0)
      .map(question => ({ ...question, id: `answers.${question.id}` }))
  ]
  return columns
})

const rows = computed(() => {
  if (unref(columns) === null || unref(pollRunResults) === null) return []
  const rows = unref(pollRunResults)
    .map(pollRunResult => {
      const answers = pollRunResult.answers
        .reduce((accumulator, { questionId, answer }) => ({
          ...accumulator,
          [questionId]: Array.isArray(answer) ? answer.join(', ') : answer === null ? '✘' : answer
        }), {})
      return { ...pollRunResult, answers }
    })
  return rows
})

const init = () => {
  loadingPollRun.value = true
  loadingResults.value = true
  fetchPollRunResults(pollRunId).then(_pollRunResults => { pollRunResults.value = _pollRunResults }).finally(() => { loadingResults.value = false })
  fetchPollRun(pollRunId).then(_pollRun => { pollRun.value = _pollRun }).finally(() => { loadingPollRun.value = false })
}

init()
</script>
