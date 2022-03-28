# VuePageKeepAlive

Vue 页面级 keep-alive 控制。 路由后退时走缓存，前进时不走缓存。

## 用法

`main.js` 中注册插件：

```js
import { PageKeepAlive } from '@/plugins/PageKeepAlive'

Vue.use(PageKeepAlive)
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
    import { PageKeepAliveComponent } from '@/plugins/PageKeepAlive'

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

## 注意

1. 页面 vue 组件中必须配置 `name`
2. 路由不能嵌套（因为 `keep-alive` 不支持嵌套路由缓存）

