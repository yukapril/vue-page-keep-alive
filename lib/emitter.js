"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitter = exports.PKA_DESTROYED_COMP_KEY = exports.PKA_CACHE_KEY = void 0;
// @ts-ignore
var mitt_1 = __importDefault(require("mitt"));
exports.PKA_CACHE_KEY = 'PageKeepAliveCached';
exports.PKA_DESTROYED_COMP_KEY = 'PageKeepAliveDestroyedComponent';
exports.emitter = (0, mitt_1.default)();
