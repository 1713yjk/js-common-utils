'use strict';

/**
 * 数组通用工具。
 * 全部为纯函数：不修改入参，不读取外部状态，不依赖任何运行时 API。
 */

/**
 * 去重，保持首次出现顺序。
 * 用 Set 做存在性判断，时间复杂度 O(n)。
 * @param {Array<*>} list 源数组
 * @returns {Array<*>} 去重后的新数组
 */
function unique(list) {
  if (!Array.isArray(list)) throw new TypeError('unique: 参数必须是数组');
  const seen = new Set();
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    if (!seen.has(list[i])) {
      seen.add(list[i]);
      out.push(list[i]);
    }
  }
  return out;
}

/**
 * 按固定长度切分数组。
 * @param {Array<*>} list 源数组
 * @param {number} size 每段长度，必须为正整数
 * @returns {Array<Array<*>>} 切分结果，最后一段可不足 size
 */
function chunk(list, size) {
  if (!Array.isArray(list)) throw new TypeError('chunk: 参数必须是数组');
  if (!Number.isInteger(size) || size <= 0) throw new RangeError('chunk: size 必须是正整数');
  const out = [];
  for (let i = 0; i < list.length; i += size) {
    out.push(list.slice(i, i + size));
  }
  return out;
}

/**
 * 扁平化一层嵌套数组。
 * 只展开一层，避免深层递归带来的栈开销，复杂度 O(n)。
 * @param {Array<*>} list 源数组
 * @returns {Array<*>} 展开一层后的新数组
 */
function flattenOne(list) {
  if (!Array.isArray(list)) throw new TypeError('flattenOne: 参数必须是数组');
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    if (Array.isArray(list[i])) {
      for (let j = 0; j < list[i].length; j += 1) out.push(list[i][j]);
    } else {
      out.push(list[i]);
    }
  }
  return out;
}

/**
 * 按 key 分组。
 * @param {Array<*>} list 源数组
 * @param {Function} keyOf 取分组键的函数，接收 (item, index)
 * @returns {Object} 以分组键为属性名的对象，值为该组元素数组
 */
function groupBy(list, keyOf) {
  if (!Array.isArray(list)) throw new TypeError('groupBy: 参数必须是数组');
  if (typeof keyOf !== 'function') throw new TypeError('groupBy: keyOf 必须是函数');
  const out = Object.create(null);
  for (let i = 0; i < list.length; i += 1) {
    const key = String(keyOf(list[i], i));
    if (!out[key]) out[key] = [];
    out[key].push(list[i]);
  }
  return out;
}

/**
 * 返回两个数组的交集（按值相等，保持 a 中顺序）。
 * @param {Array<*>} a 数组 A
 * @param {Array<*>} b 数组 B
 * @returns {Array<*>} 交集新数组
 */
function intersection(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) throw new TypeError('intersection: 参数必须是数组');
  const setB = new Set(b);
  return unique(a.filter((item) => setB.has(item)));
}

module.exports = { unique, chunk, flattenOne, groupBy, intersection };
