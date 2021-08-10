import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout'),
    children: [
      { path: '', name: 'polls', component: () => import('@/views/Polls') },
      { path: ':pollId', name: 'pollRuns', component: () => import('@/views/PollRuns'), meta: { parentRoute: 'polls' } },
      { path: ':pollId/:pollRunId', name: 'pollRunResults', component: () => import('@/views/PollRunResults'), meta: { parentRoute: 'pollRuns' } }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
