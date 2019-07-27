import { store, mutations } from '../store'

const storeMixin = {
  computed: {
    store () {
      return store
    }
  },
  methods: {
    ...mutations
  }
}

export default storeMixin
