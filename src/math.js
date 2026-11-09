'use strict';

/**
 * 数值通用工具。
 * 所有函数只依赖 Math，不含任何领域参数或默认配置。
 */

/**
 * 把数值限制在闭区间内。
 * @param {number} value 输入值
 * @param {number} min 下界
 * @param {number} max 上界
 * @returns {number}
 */
function clamp(value, min, max) {
  if (min > max) throw new RangeError('clamp: min 不能大于 max');
  return Math.min(Math.max(value, min), max);
}

/**
 * 线性插值。
 * @param {number} a 起点
 * @param {number} b 终点
 * @param {number} t 插值系数，通常在 [0,1]
 * @returns {number}
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * 四舍五入到指定小数位。
 * 先放大再缩小，避免直接 toFixed 带来的字符串转换开销。
 * @param {number} value 输入值
 * @param {number} digits 小数位数，默认 0
 * @returns {number}
 */
function roundTo(value, digits) {
  const d = digits === undefined ? 0 : digits;
  const factor = Math.pow(10, d);
  return Math.round(value * factor) / factor;
}

/**
 * 生成 [min, max] 闭区间内的随机整数。
 * @param {number} min 下界（含）
 * @param {number} max 上界（含）
 * @returns {number}
 */
function randomInt(min, max) {
  if (min > max) throw new RangeError('randomInt: min 不能大于 max');
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 计算数组元素的算术平均值，空数组返回 0。
 * @param {Array<number>} values 数值数组
 * @returns {number}
 */
function mean(values) {
  if (!Array.isArray(values)) throw new TypeError('mean: 参数必须是数组');
  if (values.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < values.length; i += 1) sum += values[i];
  return sum / values.length;
}

/**
 * 判断两个浮点数在给定误差内是否相等。
 * @param {number} a 值 A
 * @param {number} b 值 B
 * @param {number} [epsilon] 允许误差，默认 1e-9
 * @returns {boolean}
 */
function nearlyEqual(a, b, epsilon) {
  const e = epsilon === undefined ? 1e-9 : epsilon;
  return Math.abs(a - b) <= e;
}

module.exports = { clamp, lerp, roundTo, randomInt, mean, nearlyEqual };
