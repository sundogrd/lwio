<template>
  <button @click="increment">
    Count is: {{ state.count }}, double is: {{ state.double }}
    wtf: {{ wtf }}
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
import { reactive, computed, createComponent, inject } from '@vue/composition-api'
import globalStore, { StoreState } from '@/store'
import { Store } from 'vuex'
import { useStore } from '@u3u/vue-hooks'

type HomeState = {
  count: number
  double: number
}

export default createComponent({
  setup () {
    const testStore = useStore<StoreState>()
    const wtf = computed(() => testStore.value.state.wtf)
    const state: HomeState = reactive({
      count: 0,
      double: computed(() => state.count * 2)
    })

    function increment () {
      state.count++
      testStore.value.commit('changeWtf')
    }

    return {
      state,
      wtf,
      increment
    }
  }
})
</script>
