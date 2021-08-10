import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout'),
    children: [
      { path: '', name: 'polls', component: () => import('@/views/Polls'), meta: { labelFn: () => 'Polls' } },
      { path: ':pollId', name: 'pollRuns', component: () => import('@/views/PollRuns'), meta: { parentRoute: 'polls', labelFn: ({ name, params }) => 'Runs' } },
      { path: ':pollId/:pollRunId', name: 'pollRunResults', component: () => import('@/views/PollRunResults'), meta: { parentRoute: 'pollRuns', labelFn: () => 'Results' } }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
