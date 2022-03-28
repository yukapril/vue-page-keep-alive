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
        if (savedPosition) {
            return savedPosition;
        }
        else {
            return { x: 0, y: 0 };
        }
    };
};
var KeepAlive = {
    cachedPages: [],
    isRegisterScrollBehavior: false,
    add: function (page) {
        if (!page)
            return;
        if (this.cachedPages.indexOf(page) >= 0)
            return;
        this.cachedPages.push(page);
        // 复制一份再传送
        emitter_1.emitter.emit(emitter_1.PKA_CACHE_KEY, __spreadArray([], this.cachedPages, true));
    },
    remove: function (page) {
        if (!page)
            return;
        if (this.cachedPages.indexOf(page) === -1)
            return;
        this.cachedPages = this.cachedPages.filter(function (p) { return p !== page; });
        // 复制一份再传送
        emitter_1.emitter.emit(emitter_1.PKA_CACHE_KEY, __spreadArray([], this.cachedPages, true));
    },
    install: function (Vue) {
        var destroyListener = eventListener();
        emitter_1.emitter.on(emitter_1.PKA_DESTROYED_COMP_KEY, destroyListener);
        Vue.mixin({
            created: function () {
                if (!KeepAlive.isRegisterScrollBehavior)
                    registerScrollBehavior(this);
                KeepAlive.isRegisterScrollBehavior = true;
            },
            beforeRouteLeave: function (to, from, next) {
                var _a, _b, _c, _d, _e;
                var isKeep = (_a = from.meta) === null || _a === void 0 ? void 0 : _a.keepAlive;
                if (isKeep) {
                    // @ts-ignore
                    var name_1 = (_e = (_d = (_c = (_b = this.$vnode) === null || _b === void 0 ? void 0 : _b.componentOptions) === null || _c === void 0 ? void 0 : _c.Ctor) === null || _d === void 0 ? void 0 : _d.options) === null || _e === void 0 ? void 0 : _e.name;
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
