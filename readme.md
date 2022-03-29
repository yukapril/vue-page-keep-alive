# VuePageKeepAlive

Vue 页面级 keep-alive 控制。 路由后退时走缓存，前进时不走缓存。

## 用法

`main.js` 中注册插件：

```js
import { PageKeepAlive } from 'vue-page-keep-alive'

Vue.use(PageKeepAlive)

// 如果需要调试，可以传入参数。此时会打印 `console.log` 日志。
Vue.use(PageKeepAlive, { debug: true })
```

`App.vue` 中进行组件嵌套：

```html

<template>
    <div id="app">
        <PageKeepAliveComponent>
            <router-view/>
        </PageKeepAliveComponent>
    </div>
</template>
<script>
    import { PageKeepAliveComponent } from 'vue-page-keep-alive'

    export default {
        components: { PageKeepAliveComponent },
    }
</script>
```

在路由配置中，对需要开启缓存的页面，配置 meta 属性 `keepAlive: true`：

```js
const routes = [
  {
    path: '/home',
    name: 'homepage',
    meta: { keepAlive: true },
    component: '...'
  }
]
```

如果路由中没有配置 `scrollBehavior`，则默认会配置为：

```js

const router = new Router({
  scrollBehavior: function (to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  }
})
```

如果路由中存在 `scrollBehavior`，则以原有为准。

## 注意

1. 页面 vue 组件中必须配置 `name`
2. 路由不能嵌套（因为 `keep-alive` 不支持嵌套路由缓存）

