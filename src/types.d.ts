import { VueConstructor } from 'vue'

export interface KeepAliveObject {
  cachedPages: string[]
  isRegisterScrollBehavior: boolean
  add(string): void
  remove(string): void
  install(VueConstructor): void
}
export interface KeepAliveCache {
  isBack: boolean
}