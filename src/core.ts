import { emitter, PKA_CACHE_KEY, PKA_DESTROYED_COMP_KEY } from './emitter'
import { KeepAliveCache, KeepAliveObject, KeepAliveOptions } from './types'
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
    return savedPosition || { x: 0, y: 0 }
  }
}

const KeepAlive: KeepAliveObject = {
  debug: false,

  cachedPages: [],

  isRegisterScrollBehavior: false,

  add(page) {
    if (!page) return
    if (this.cachedPages.indexOf(page) >= 0) return
    this.cachedPages.push(page)
    if (this.debug) console.log(`[KeepAlive] 增加缓存页 ${page}`)
    // 复制一份再传送
    emitter.emit(PKA_CACHE_KEY, [...this.cachedPages])
  },

  remove(page) {
    if (!page) return
    if (this.cachedPages.indexOf(page) === -1) return
    this.cachedPages = this.cachedPages.filter(p => p !== page)
    if (this.debug) console.log(`[KeepAlive] 移除缓存 ${page}`)
    // 复制一份再传送
    emitter.emit(PKA_CACHE_KEY, [...this.cachedPages])
  },

  install(Vue: VueConstructor, options: KeepAliveOptions) {
    const destroyListener = eventListener()
    emitter.on(PKA_DESTROYED_COMP_KEY, destroyListener)

    if (options.debug) KeepAlive.debug = true

    Vue.mixin({
      created() {
        if (!KeepAlive.isRegisterScrollBehavior) registerScrollBehavior((this as Vue))
        KeepAlive.isRegisterScrollBehavior = true
      },
      beforeRouteLeave(to, from, next) {
        const isKeep = !!from.meta?.keepAlive
        if (KeepAlive.debug) console.log(`[KeepAlive] 路由即将跳转，从 ${from.name} -> ${to.name}，当前是否开启KeepAlive：${isKeep}`)
        if (isKeep) {
          // @ts-ignore
          const name = (this as Vue).$vnode?.componentOptions?.Ctor?.options?.name
          if (KeepAlive.debug) console.log(`[KeepAlive] 路由即将跳转，需要缓存页面页面名：${name}`)
          if (!name) console.warn(`[KeepAlive] ${from.name} 开启了 KeepAlive，但是缺少 name 无法缓存。检查 vue 文件中是否忘记配置了 name。`)
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
