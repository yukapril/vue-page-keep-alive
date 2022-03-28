<template>
  <keep-alive :include="cachedPages">
    <slot/>
  </keep-alive>
</template>
<script>
import { emitter, PKA_CACHE_KEY, PKA_DESTROYED_COMP_KEY } from './emitter'

export default {
  data () {
    return {
      cachedPages: ''
    }
  },
  created () {
    emitter.on(PKA_CACHE_KEY, data => {
      this.cachedPages = data
    })
  },
  destroyed () {
    emitter.emit(PKA_DESTROYED_COMP_KEY)
  }
}
</script>
