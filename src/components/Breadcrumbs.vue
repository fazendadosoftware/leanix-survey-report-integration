<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="bg-white rounded-md shadow px-6 flex space-x-4">
      <li v-if="breadcrumbs.length" class="flex">
        <div class="flex items-center">
          <router-link :to="{ name: breadcrumbs[0].name, params: breadcrumbs[0].params }" class="text-gray-400 hover:text-gray-500">
            <HomeIcon class="flex-shrink-0 h-5 w-5" aria-hidden="true" />
            <span class="sr-only">Home</span>
          </router-link>
        </div>
      </li>
      <li
        v-for="breadcrumb in breadcrumbs"
        :key="breadcrumb.name"
        class="flex">
        <div
          class="flex items-center">
          <svg class="flex-shrink-0 w-6 h-full text-gray-200" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
          </svg>
          <router-link
            :to="{ name: breadcrumb.name, params: breadcrumb.params }"
            class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
            {{breadcrumb.label}}
          </router-link>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script>
import { computed } from 'vue'
import { HomeIcon } from '@heroicons/vue/solid'
import { useRoute, useRouter } from 'vue-router'

const pages = [
  { name: 'Poll #f9bd4348d933', href: '#', current: false },
  { name: 'Poll Run #4c5aba971a33', href: '#', current: true }
]

export default {
  components: {
    HomeIcon
  },
  setup () {
    const route = useRoute()
    const { getRoutes } = useRouter()
    const routeParentIndex = getRoutes()
      .reduce((accumulator, { name, meta: { labelFn = null, parentRoute = null } }) => {
        accumulator[name] = { parentRoute, labelFn }
        return accumulator
      }, {})

    const breadcrumbs = computed(() => {
      const breadcrumbs = []
      let { name, params } = route
      let parentRoute
      let labelFn
      do {
        ({ parentRoute = null, labelFn = null } = routeParentIndex[name] || {})
        const label = typeof labelFn === 'function' ? labelFn({ name, params }) : name
        breadcrumbs.unshift({ name, label, params })
        name = parentRoute
      } while (parentRoute !== null)
      return breadcrumbs
    })
    return {
      route,
      pages,
      breadcrumbs
    }
  }
}
</script>
