import { VueConstructor } from 'vue'

export interface KeepAliveOptions {
  debug: boolean
}

export interface KeepAliveObject {
  debug: boolean
  cachedPages: string[]
  isRegisterScrollBehavior: boolean

  add(string): void

  remove(string): void

  install(VueConstructor, KeepAliveOptions): void
}

export interface KeepAliveCache {
  isBack: boolean
}
