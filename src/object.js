'use strict';

/**
 * 对象通用工具。
 * 不假设任何业务字段，只处理键路径与浅层结构。
 */

/**
 * 判断是否为普通对象（排除数组、null、Date 等）。
 * @param {*} value 待判断值
 * @returns {boolean}
 */
function isPlainObject(value) {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * 按键路径读取嵌套值，路径不存在时返回默认值。
 * @param {Object} source 源对象
 * @param {string|Array<string>} path 形如 'a.b.0' 或 ['a','b','0']
 * @param {*} fallback 取不到时的默认值
 * @returns {*}
 */
function get(source, path, fallback) {
  const keys = Array.isArray(path) ? path : String(path).split('.');
  let cur = source;
  for (let i = 0; i < keys.length; i += 1) {
    if (cur === null || cur === undefined) return fallback;
    cur = cur[keys[i]];
  }
  return cur === undefined ? fallback : cur;
}

/**
 * 按键路径写入值，中间层不存在时自动创建普通对象。
 * 会修改传入的对象；需要不可变语义时先自行克隆。
 * @param {Object} target 目标对象
 * @param {string|Array<string>} path 键路径
 * @param {*} value 写入值
 * @returns {Object} 返回 target 本身，便于链式调用
 */
function set(target, path, value) {
  if (!isPlainObject(target)) throw new TypeError('set: target 必须是普通对象');
  const keys = Array.isArray(path) ? path : String(path).split('.');
  let cur = target;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    if (!isPlainObject(cur[key])) cur[key] = {};
    cur = cur[key];
  }
  cur[keys[keys.length - 1]] = value;
  return target;
}

/**
 * 挑选指定键，生成新对象。
 * @param {Object} source 源对象
 * @param {Array<string>} keys 需要的键
 * @returns {Object}
 */
function pick(source, keys) {
  if (!isPlainObject(source)) throw new TypeError('pick: source 必须是普通对象');
  const out = {};
  for (let i = 0; i < keys.length; i += 1) {
    if (Object.prototype.hasOwnProperty.call(source, keys[i])) out[keys[i]] = source[keys[i]];
  }
  return out;
}

/**
 * 排除指定键，生成新对象。
 * @param {Object} source 源对象
 * @param {Array<string>} keys 要排除的键
 * @returns {Object}
 */
function omit(source, keys) {
  if (!isPlainObject(source)) throw new TypeError('omit: source 必须是普通对象');
  const excluded = new Set(keys);
  const out = {};
  const own = Object.keys(source);
  for (let i = 0; i < own.length; i += 1) {
    if (!excluded.has(own[i])) out[own[i]] = source[own[i]];
  }
  return out;
}

/**
 * 深拷贝普通对象与数组。
 * 使用 WeakMap 记录已访问对象以处理循环引用；不处理 Map/Set/Date/函数，
 * 这些类型按引用返回，避免隐含的平台差异。
 * @param {*} value 待拷贝值
 * @param {WeakMap} [seen] 内部递归用，外部无需传入
 * @returns {*}
 */
function deepClone(value, seen) {
  const memo = seen || new WeakMap();
  if (value === null || typeof value !== 'object') return value;
  if (memo.has(value)) return memo.get(value);
  if (Array.isArray(value)) {
    const arr = [];
    memo.set(value, arr);
    for (let i = 0; i < value.length; i += 1) arr.push(deepClone(value[i], memo));
    return arr;
  }
  if (!isPlainObject(value)) return value;
  const out = {};
  memo.set(value, out);
  const keys = Object.keys(value);
  for (let i = 0; i < keys.length; i += 1) out[keys[i]] = deepClone(value[keys[i]], memo);
  return out;
}

/**
 * 浅合并多个对象，后者覆盖前者，返回新对象。
 * @param {...Object} sources 源对象
 * @returns {Object}
 */
function merge() {
  const out = {};
  for (let i = 0; i < arguments.length; i += 1) {
    if (isPlainObject(arguments[i])) Object.assign(out, arguments[i]);
  }
  return out;
}

module.exports = { isPlainObject, get, set, pick, omit, deepClone, merge };
