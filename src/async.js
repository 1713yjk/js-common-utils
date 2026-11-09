'use strict';

/**
 * 异步流程通用工具。
 * 只处理 Promise 的时序与并发，不规定任何接口地址或数据格式。
 */

/**
 * 等待指定毫秒。
 * @param {number} ms 毫秒数
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

/**
 * 为 Promise 增加超时限制，超时后以 Error 拒绝。
 * 注意：超时不会取消原始 Promise，仅不再等待其结果。
 * @param {Promise<*>} promise 原始 Promise
 * @param {number} ms 超时毫秒数
 * @returns {Promise<*>}
 */
function withTimeout(promise, ms) {
  return new Promise(function (resolve, reject) {
    const timer = setTimeout(function () {
      reject(new Error('operation timed out after ' + ms + 'ms'));
    }, ms);
    Promise.resolve(promise).then(
      function (value) { clearTimeout(timer); resolve(value); },
      function (err) { clearTimeout(timer); reject(err); }
    );
  });
}

/**
 * 带固定次数重试的异步执行。
 * 第 attempt 次失败后等待 delay * (attempt + 1) 毫秒再试。
 * @param {Function} task 返回 Promise 的无参函数
 * @param {Object} [options] { retries: 重试次数, delay: 基础等待毫秒 }
 * @returns {Promise<*>}
 */
function retry(task, options) {
  if (typeof task !== 'function') throw new TypeError('retry: task 必须是函数');
  const retries = options && options.retries !== undefined ? options.retries : 2;
  const delay = options && options.delay !== undefined ? options.delay : 0;
  return new Promise(function (resolve, reject) {
    let attempt = 0;
    function run() {
      Promise.resolve().then(task).then(resolve, function (err) {
        if (attempt >= retries) { reject(err); return; }
        const wait = delay * (attempt + 1);
        attempt += 1;
        setTimeout(run, wait);
      });
    }
    run();
  });
}

/**
 * 限制并发地执行一组任务，保持结果与输入顺序一致。
 * 通过固定数量的 worker 消费同一个索引游标实现，复杂度 O(n)。
 * @param {Array<*>} items 输入项
 * @param {number} limit 最大并发数
 * @param {Function} worker 处理单项的函数，返回 Promise
 * @returns {Promise<Array<*>>}
 */
function mapLimit(items, limit, worker) {
  if (!Array.isArray(items)) throw new TypeError('mapLimit: items 必须是数组');
  if (!Number.isInteger(limit) || limit <= 0) throw new RangeError('mapLimit: limit 必须是正整数');
  if (typeof worker !== 'function') throw new TypeError('mapLimit: worker 必须是函数');
  const results = new Array(items.length);
  let cursor = 0;
  const count = Math.min(limit, items.length);
  function spawn() {
    return new Promise(function (resolve, reject) {
      function step() {
        const index = cursor;
        cursor += 1;
        if (index >= items.length) { resolve(); return; }
        Promise.resolve().then(function () { return worker(items[index], index); }).then(
          function (value) { results[index] = value; step(); },
          reject
        );
      }
      step();
    });
  }
  const workers = [];
  for (let i = 0; i < count; i += 1) workers.push(spawn());
  return Promise.all(workers).then(function () { return results; });
}

/**
 * 把任意值统一包装为 Promise（等价于 Promise.resolve，提供显式命名）。
 * @param {*} value 任意值
 * @returns {Promise<*>}
 */
function toPromise(value) {
  return Promise.resolve(value);
}

module.exports = { sleep, withTimeout, retry, mapLimit, toPromise };
