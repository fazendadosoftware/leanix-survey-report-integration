import { computed, reactive, watch } from 'vue'
import '@leanix/reporting' /* global lx */

const state = reactive({
  baseUrl: null,
  origin: null,
  polls: null,
  selectedPoll: null,
  outgoingRequests: 0,
  reportInitialized: false
})

watch(state, ({ outgoingRequests }) => outgoingRequests > 0 ? lx.showSpinner() : lx.hideSpinner())

const polls = computed(() => state.polls)

const selectedPoll = computed({
  get: () => state.selectedPoll,
  set: poll => { state.selectedPoll = poll }
})

const initializeReport = async () => {
  const reportSetup = await lx.init()
  const { settings: { baseUrl, workspace: { name } } } = reportSetup
  state.baseUrl = baseUrl
  state.origin = baseUrl.replace(`/${name}`, '')
  const reportConfig = {
    ui: {
      elements: {
        root: {
          items: [
            /*
            {
              type: 'button',
              tooltip: 'Refresh',
              label: { icon: 'fa fa-sync fa-spin' },
              click: fetchPolls
            }
            */
          ],
          style: {
            justifyContent: 'end'
          }
        }
      },
      update: () => {}
    }
  }
  await lx.ready(reportConfig)
  state.reportInitialized = true
}

const fetchPolls = async () => {
  if (state.origin === null) throw Error('Report still not initialized')
  const url = `${state.origin}/services/poll/v2/polls`
  try {
    state.outgoingRequests++
    state.polls = await lx.executeParentOriginXHR('GET', url)
      .then(({ body }) => JSON.parse(body))
      .then(({ data }) => data)
  } finally {
    state.outgoingRequests--
  }
}

const fetchPollRuns = async pollId => {
  const url = `${state.origin}/services/poll/v2/polls/${pollId}/pollRuns`
  const pollRuns = await lx.executeParentOriginXHR('GET', url)
    .then(({ body }) => JSON.parse(body).data)
  return pollRuns
}

const fetchPollRunResults = async pollRunId => {
  const url = `${state.origin}/services/poll/v2/pollRuns/${pollRunId}/pollResults`
  const pollRunResults = await lx.executeParentOriginXHR('GET', url)
    .then(({ body }) => JSON.parse(body).data)
  return pollRunResults
}

const openSidePane = () => {
  const sidePaneElements = {
    factsheet: {
      type: 'FactSheet',
      factSheetId: '28fe4aa2-6e46-41a1-a131-72afb3acf256',
      detailFields: ['displayName'],
      relations: [],
      pointOfView: {
        id: '1',
        changeSet: {
          type: 'dateOnly',
          date: new Date()
        }
      }
    }
  }
  lx.openSidePane(sidePaneElements)
}

export default () => ({
  initializeReport,
  reportInitialized: computed(() => state.reportInitialized),
  fetchPolls,
  fetchPollRuns,
  fetchPollRunResults,
  polls,
  selectedPoll,
  openSidePane
})
