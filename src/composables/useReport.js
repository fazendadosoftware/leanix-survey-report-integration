import { computed, reactive, watch } from 'vue'
import '@leanix/reporting' /* global lx */
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const state = reactive({
  baseUrl: null,
  origin: null,
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
  loadAxiformaFonts(state.baseUrl)
}

const loadAxiformaFonts = async baseUrl => {
  const fonts = [
    { fontName: 'Axiforma-Regular', fileName: '39568C_F_0.228641b0955040e351ea.woff2' },
    { fontName: 'Axiforma-Bold', fileName: '39568C_0_0.adaeb02b1e875fd68248.woff2' }
  ]
  try {
    const fontFaces = await Promise
      .all(fonts.map(({ fontName, fileName }) => new FontFace(fontName, `url(${baseUrl}/${fileName})`).load()))
    fontFaces.forEach(face => document.fonts.add(face))
  } catch (error) {
    lx.showToastr('warning', 'Could not load Axiforma font')
    console.warn(error)
  }
}

const fetchPolls = async () => {
  const url = `${state.origin}/services/poll/v2/polls`
  try {
    state.outgoingRequests++
    const polls = await lx.executeParentOriginXHR('GET', url)
      .then(({ body }) => JSON.parse(body))
      .then(({ data }) => data)
    return polls
  } finally {
    state.outgoingRequests--
  }
}

const fetchPoll = async pollId => {
  const url = `${state.origin}/services/poll/v2/polls/${pollId}`
  try {
    state.outgoingRequests++
    const poll = await lx.executeParentOriginXHR('GET', url)
      .then(({ body }) => JSON.parse(body))
      .then(({ data }) => data)
    return poll
  } finally {
    state.outgoingRequests--
  }
}

const fetchPollRuns = async pollId => {
  const url = `${state.origin}/services/poll/v2/polls/${pollId}/pollRuns`
  try {
    state.outgoingRequests++
    const pollRuns = await lx.executeParentOriginXHR('GET', url)
      .then(({ body }) => JSON.parse(body).data)
    return pollRuns
  } finally {
    state.outgoingRequests--
  }
}

const fetchPollRun = async pollRunId => {
  const url = `${state.origin}/services/poll/v2/pollRuns/${pollRunId}`
  try {
    state.outgoingRequests++
    const pollRun = await lx.executeParentOriginXHR('GET', url)
      .then(({ body }) => JSON.parse(body).data)
    return pollRun
  } finally {
    state.outgoingRequests--
  }
}

const fetchPollRunResults = async pollRunId => {
  const url = `${state.origin}/services/poll/v2/pollRuns/${pollRunId}/pollResults`
  const pollRunResults = await lx.executeParentOriginXHR('GET', url)
    .then(({ body }) => JSON.parse(body).data)
  return pollRunResults
}

const showFactSheet = ({ type, id }) => {
  const url = `${state.baseUrl}/factsheet/${type}/${id}`
  lx.openLink(url)
}

const openFactSheetOnSidePane = ({ id, type }) => {
  const sidePaneElements = {
    factsheet: {
      type: 'FactSheet',
      factSheetId: id,
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

const formatDateAsDistanceToNow = dateString => formatDistanceToNow(new Date(dateString).getTime(), { addSuffix: true })

export default function useReport () {
  return {
    initializeReport,
    reportInitialized: computed(() => state.reportInitialized),
    fetchPolls,
    fetchPoll,
    fetchPollRuns,
    fetchPollRun,
    fetchPollRunResults,
    polls,
    selectedPoll,
    showFactSheet,
    formatDateAsDistanceToNow,
    openFactSheetOnSidePane
  }
}
