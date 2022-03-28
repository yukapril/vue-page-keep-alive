import { emitter, PKA_CACHE_KEY, PKA_DESTROYED_COMP_KEY } from './emitter'
import { KeepAliveCache, KeepAliveObject } from './types'
import Vue, { VueConstructor } from 'vue'
import 'vue-router'

const cache: KeepAliveCache = {
  isBack: false
}

const eventListener = () => {
  const handle = () => {
    cache.isBack = true
  }
  window.addEventListener('popstate', handle)
  return () => {
    window.removeEventListener('popstate', handle)
  }
}

const registerScrollBehavior = (vm: Vue) => {
  const hasBehavior = vm.$router.options.scrollBehavior
  if (hasBehavior) return
  vm.$router.options.scrollBehavior = (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
}

const KeepAlive: KeepAliveObject = {
  cachedPages: [],

  isRegisterScrollBehavior: false,

  add(page) {
    if (!page) return
    if (this.cachedPages.indexOf(page) >= 0) return
    this.cachedPages.push(page)
    // 复制一份再传送
    emitter.emit(PKA_CACHE_KEY, [...this.cachedPages])
  },

  remove(page) {
    if (!page) return
    if (this.cachedPages.indexOf(page) === -1) return
    this.cachedPages = this.cachedPages.filter(p => p !== page)
    // 复制一份再传送
    emitter.emit(PKA_CACHE_KEY, [...this.cachedPages])
  },

  install(Vue: VueConstructor) {
    const destroyListener = eventListener()
    emitter.on(PKA_DESTROYED_COMP_KEY, destroyListener)

    Vue.mixin({
      created() {
        if (!KeepAlive.isRegisterScrollBehavior) registerScrollBehavior((this as Vue))
        KeepAlive.isRegisterScrollBehavior = true
      },
      beforeRouteLeave(to, from, next) {
        const isKeep = from.meta?.keepAlive
        if (isKeep) {
          // @ts-ignore
          const name = (this as Vue).$vnode?.componentOptions?.Ctor?.options?.name

          if (cache.isBack) {
            // 此时为后退
            // 要考虑删除缓存 from（当前页）
            KeepAlive.remove(name)
          } else {
            // 此时为同页面跳转或者前进到新页
            // 要考虑缓存 from（当前页）
            KeepAlive.add(name)
          }
        }

        cache.isBack = false
        next()
      }
    })
  }
}

export default KeepAlive
