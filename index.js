'use strict';

/**
 * js-common-utils —— 零依赖的 JavaScript 通用工具集。
 *
 * 定位：只提供与具体业务无关的基础操作（数组、对象、函数、数值、
 * 字符串、异步流程、事件分发）。源码仅包含上述通用操作，不含领域数据、
 * 界面文案或平台专属接口。
 *
 * 运行环境：Node.js（CommonJS）与浏览器 / 小游戏（拷贝 src 目录按需引用）。
 * 所有模块均为 ES5 语法加少量 ES6 内置对象（Set / WeakMap / Promise），
 * 未使用任何编译、加密或混淆步骤，源码即发布内容。
 */

const array = require('./src/array');
const object = require('./src/object');
const fn = require('./src/function');
const math = require('./src/math');
const string = require('./src/string');
const async = require('./src/async');
const eventBus = require('./src/event-bus');

module.exports = {
  // 分命名空间导出，避免同名函数冲突，也便于按需引用单个模块
  array: array,
  object: object,
  fn: fn,
  math: math,
  string: string,
  async: async,
  eventBus: eventBus,
  version: '1.0.0'
};
