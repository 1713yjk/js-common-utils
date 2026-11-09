'use strict';

/**
 * 极简事件总线（发布/订阅）。
 * 事件名由调用方自行定义，本模块不预置任何事件类型，也不解释事件内容。
 */

/**
 * 创建一个独立的事件总线实例。
 * 各实例互不干扰，避免全局单例带来的隐式耦合。
 * @returns {Object} { on, once, off, emit, clear, listenerCount }
 */
function createEventBus() {
  const listeners = Object.create(null);

  /**
   * 订阅事件。
   * @param {string} name 事件名
   * @param {Function} handler 回调
   * @returns {Function} 取消订阅的函数
   */
  function on(name, handler) {
    if (typeof handler !== 'function') throw new TypeError('on: handler 必须是函数');
    if (!listeners[name]) listeners[name] = [];
    listeners[name].push({ handler: handler, once: false });
    return function () { off(name, handler); };
  }

  /**
   * 订阅事件但只触发一次。
   * @param {string} name 事件名
   * @param {Function} handler 回调
   * @returns {Function} 取消订阅的函数
   */
  function once(name, handler) {
    if (typeof handler !== 'function') throw new TypeError('once: handler 必须是函数');
    if (!listeners[name]) listeners[name] = [];
    listeners[name].push({ handler: handler, once: true });
    return function () { off(name, handler); };
  }

  /**
   * 取消订阅。省略 handler 时移除该事件的全部监听。
   * @param {string} name 事件名
   * @param {Function} [handler] 指定回调
   */
  function off(name, handler) {
    if (!listeners[name]) return;
    if (handler === undefined) { delete listeners[name]; return; }
    listeners[name] = listeners[name].filter(function (entry) { return entry.handler !== handler; });
    if (listeners[name].length === 0) delete listeners[name];
  }

  /**
   * 触发事件。先复制一份监听列表，使回调内部增删订阅不影响本次遍历。
   * 单个回调抛错不会中断其余回调。
   * @param {string} name 事件名
   * @param {*} payload 传递给回调的数据
   */
  function emit(name, payload) {
    const entries = listeners[name];
    if (!entries || entries.length === 0) return;
    const snapshot = entries.slice();
    const remaining = [];
    for (let i = 0; i < snapshot.length; i += 1) {
      if (!snapshot[i].once) remaining.push(snapshot[i]);
      try {
        snapshot[i].handler(payload);
      } catch (err) {
        // 隔离订阅者异常，保证事件分发不被单个回调终止
        if (typeof console !== 'undefined' && console.error) console.error(err);
      }
    }
    listeners[name] = remaining;
    if (remaining.length === 0) delete listeners[name];
  }

  /** 清空全部订阅。 */
  function clear() {
    Object.keys(listeners).forEach(function (key) { delete listeners[key]; });
  }

  /** 查询某事件的监听数量。 */
  function listenerCount(name) {
    return listeners[name] ? listeners[name].length : 0;
  }

  return { on: on, once: once, off: off, emit: emit, clear: clear, listenerCount: listenerCount };
}

module.exports = { createEventBus };
