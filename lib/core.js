"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var emitter_1 = require("./emitter");
require("vue-router");
var cache = {
    isBack: false
};
var eventListener = function () {
    var handle = function () {
        cache.isBack = true;
    };
    window.addEventListener('popstate', handle);
    return function () {
        window.removeEventListener('popstate', handle);
    };
};
var registerScrollBehavior = function (vm) {
    var hasBehavior = vm.$router.options.scrollBehavior;
    if (hasBehavior)
        return;
    vm.$router.options.scrollBehavior = function (to, from, savedPosition) {
        return savedPosition || { x: 0, y: 0 };
    };
};
var KeepAlive = {
    debug: false,
    cachedPages: [],
    isRegisterScrollBehavior: false,
    add: function (page) {
        if (!page)
            return;
        if (this.cachedPages.indexOf(page) >= 0)
            return;
        this.cachedPages.push(page);
        if (this.debug)
            console.log("[KeepAlive] \u589E\u52A0\u7F13\u5B58\u9875 ".concat(page));
        // 复制一份再传送
        emitter_1.emitter.emit(emitter_1.PKA_CACHE_KEY, __spreadArray([], this.cachedPages, true));
    },
    remove: function (page) {
        if (!page)
            return;
        if (this.cachedPages.indexOf(page) === -1)
            return;
        this.cachedPages = this.cachedPages.filter(function (p) { return p !== page; });
        if (this.debug)
            console.log("[KeepAlive] \u79FB\u9664\u7F13\u5B58 ".concat(page));
        // 复制一份再传送
        emitter_1.emitter.emit(emitter_1.PKA_CACHE_KEY, __spreadArray([], this.cachedPages, true));
    },
    install: function (Vue, options) {
        var destroyListener = eventListener();
        emitter_1.emitter.on(emitter_1.PKA_DESTROYED_COMP_KEY, destroyListener);
        if (options.debug)
            KeepAlive.debug = true;
        Vue.mixin({
            created: function () {
                if (!KeepAlive.isRegisterScrollBehavior)
                    registerScrollBehavior(this);
                KeepAlive.isRegisterScrollBehavior = true;
            },
            beforeRouteLeave: function (to, from, next) {
                var _a, _b, _c, _d, _e;
                var isKeep = !!((_a = from.meta) === null || _a === void 0 ? void 0 : _a.keepAlive);
                if (KeepAlive.debug)
                    console.log("[KeepAlive] \u8DEF\u7531\u5373\u5C06\u8DF3\u8F6C\uFF0C\u4ECE ".concat(from.name, " -> ").concat(to.name, "\uFF0C\u5F53\u524D\u662F\u5426\u5F00\u542FKeepAlive\uFF1A").concat(isKeep));
                if (isKeep) {
                    // @ts-ignore
                    var name_1 = (_e = (_d = (_c = (_b = this.$vnode) === null || _b === void 0 ? void 0 : _b.componentOptions) === null || _c === void 0 ? void 0 : _c.Ctor) === null || _d === void 0 ? void 0 : _d.options) === null || _e === void 0 ? void 0 : _e.name;
                    if (KeepAlive.debug)
                        console.log("[KeepAlive] \u8DEF\u7531\u5373\u5C06\u8DF3\u8F6C\uFF0C\u9700\u8981\u7F13\u5B58\u9875\u9762\u9875\u9762\u540D\uFF1A".concat(name_1));
                    if (!name_1)
                        console.warn("[KeepAlive] ".concat(from.name, " \u5F00\u542F\u4E86 KeepAlive\uFF0C\u4F46\u662F\u7F3A\u5C11 name \u65E0\u6CD5\u7F13\u5B58\u3002\u68C0\u67E5 vue \u6587\u4EF6\u4E2D\u662F\u5426\u5FD8\u8BB0\u914D\u7F6E\u4E86 name\u3002"));
                    if (cache.isBack) {
                        // 此时为后退
                        // 要考虑删除缓存 from（当前页）
                        KeepAlive.remove(name_1);
                    }
                    else {
                        // 此时为同页面跳转或者前进到新页
                        // 要考虑缓存 from（当前页）
                        KeepAlive.add(name_1);
                    }
                }
                cache.isBack = false;
                next();
            }
        });
    }
};
exports.default = KeepAlive;
