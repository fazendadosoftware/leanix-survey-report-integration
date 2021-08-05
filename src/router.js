import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout'),
    redirect: { name: 'polls' },
    children: [
      { path: 'polls', name: 'polls', component: () => import('@/views/Polls') },
      { path: 'poll/:id/pollRuns', name: 'pollRuns', component: () => import('@/views/PollRuns') },
      { path: 'pollRunResults/:id', name: 'pollRunResults', component: () => import('@/views/PollRunResults') }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
