'use strict';

/**
 * 函数通用工具：节流、防抖、单次执行、结果缓存。
 * 只处理调用时序，不涉及任何具体业务规则。
 */

/**
 * 防抖：连续调用时只执行最后一次。
 * @param {Function} fn 目标函数
 * @param {number} wait 静默等待毫秒数
 * @returns {Function} 包装后的函数，带 cancel() 方法
 */
function debounce(fn, wait) {
  if (typeof fn !== 'function') throw new TypeError('debounce: fn 必须是函数');
  let timer = null;
  function wrapped() {
    const args = arguments;
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(function () {
      timer = null;
      fn.apply(null, args);
    }, wait);
  }
  wrapped.cancel = function () {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };
  return wrapped;
}

/**
 * 节流：每个时间窗口内最多执行一次（首次立即执行）。
 * @param {Function} fn 目标函数
 * @param {number} interval 窗口毫秒数
 * @returns {Function} 包装后的函数
 */
function throttle(fn, interval) {
  if (typeof fn !== 'function') throw new TypeError('throttle: fn 必须是函数');
  let last = 0;
  return function () {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      return fn.apply(null, arguments);
    }
    return undefined;
  };
}

/**
 * 保证函数只执行一次，后续调用返回首次结果。
 * @param {Function} fn 目标函数
 * @returns {Function}
 */
function once(fn) {
  if (typeof fn !== 'function') throw new TypeError('once: fn 必须是函数');
  let called = false;
  let result;
  return function () {
    if (!called) {
      called = true;
      result = fn.apply(null, arguments);
    }
    return result;
  };
}

/**
 * 按参数生成缓存键的结果缓存（同步函数专用）。
 * 键由 JSON.stringify 生成，因此仅适用于可序列化的参数。
 * @param {Function} fn 纯函数或可缓存函数
 * @returns {Function} 带 cache 属性与 clear() 方法的包装函数
 */
function memoize(fn) {
  if (typeof fn !== 'function') throw new TypeError('memoize: fn 必须是函数');
  const cache = Object.create(null);
  function wrapped() {
    const key = JSON.stringify(Array.prototype.slice.call(arguments));
    if (Object.prototype.hasOwnProperty.call(cache, key)) return cache[key];
    const value = fn.apply(null, arguments);
    cache[key] = value;
    return value;
  }
  wrapped.cache = cache;
  wrapped.clear = function () {
    Object.keys(cache).forEach(function (k) { delete cache[k]; });
  };
  return wrapped;
}

module.exports = { debounce, throttle, once, memoize };
