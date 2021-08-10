<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="bg-white rounded-md shadow px-6 flex space-x-4">
      <li
        v-for="(breadcrumb, i) in breadcrumbs"
        :key="breadcrumb.name"
        class="flex">
        <div class="flex items-center h-full">
          <router-link
            v-if="i === 0"
            :to="{ name: breadcrumb.name }"
            class="flex items-center text-gray-400 hover:text-gray-500">
            <HomeIcon class="flex-shrink-0 h-5 w-5" aria-hidden="true" />
            <span class="ml-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              {{breadcrumb.name}}
            </span>
          </router-link>
          <template v-else>
            <svg class="flex-shrink-0 w-6 h-full text-gray-200" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
            </svg>
            <router-link
              :to="{ name: breadcrumb.name, params: breadcrumb.params }"
              class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
              {{breadcrumb.name}}
            </router-link>
          </template>
            <!--<a :href="page.href" class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700" :aria-current="page.current ? 'page' : undefined">{{ page.name }}</a>-->
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
      .reduce((accumulator, { name, meta: { parentRoute = null } }) => {
        accumulator[name] = parentRoute
        return accumulator
      }, {})

    const breadcrumbs = computed(() => {
      const { name, params } = route
      const breadcrumbs = [{ name, params }]
      let { [name]: parentRoute = null } = routeParentIndex || {}
      while (parentRoute !== null) {
        breadcrumbs.unshift({ name: parentRoute, params });
        ({ [parentRoute]: parentRoute = null } = routeParentIndex || {})
      }
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
