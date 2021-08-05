import { ref, computed, unref } from 'vue'
import Fuse from 'fuse.js'
import { debounce } from 'throttle-debounce'

export default function useFuse (list = ref([]), options = {}) {
  const _query = ref('')

  const { limit = 100, matchAllOnEmptyQuery = true, debounceSearchInput = 100, ...fuseOptions } = options

  const fuse = computed(() => new Fuse(list.value || [], { includeMatches: true, ...fuseOptions }))

  const hits = computed(() => {
    const query = unref(_query)
    const f = unref(fuse)
    const hits = !query && matchAllOnEmptyQuery
      ? f.getIndex().docs.slice(0, limit).map((item, refIndex) => ({ item, refIndex }))
      : f.search(query, { limit })
    return hits
  })

  const query = computed({
    get: () => unref(_query),
    set: debounce(debounceSearchInput, query => { _query.value = query })
  })

  return {
    hits,
    query
  }
}
