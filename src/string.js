'use strict';

/**
 * 字符串通用工具。
 * 纯字符串变换，不含任何文案、名称表或内容规则。
 */

/**
 * 转义正则表达式中的特殊字符，使字符串可安全拼进 RegExp。
 * @param {string} text 原始字符串
 * @returns {string} 转义后的字符串
 */
function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 按最大长度截断字符串，超长时追加指定的省略标记。
 * @param {string} text 原始字符串
 * @param {number} maxLength 最大长度
 * @param {string} [suffix] 省略标记，默认 '...'
 * @returns {string}
 */
function truncate(text, maxLength, suffix) {
  const s = String(text);
  const tail = suffix === undefined ? '...' : suffix;
  if (s.length <= maxLength) return s;
  if (maxLength <= tail.length) return tail.slice(0, maxLength);
  return s.slice(0, maxLength - tail.length) + tail;
}

/**
 * 将连字符/下划线/空格分隔的词转为小驼峰。
 * @param {string} text 输入字符串
 * @returns {string}
 */
function toCamelCase(text) {
  const parts = String(text).split(/[-_\s]+/).filter(Boolean);
  if (parts.length === 0) return '';
  return parts.map(function (part, index) {
    const lower = part.toLowerCase();
    if (index === 0) return lower;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join('');
}

/**
 * 补齐字符串到指定长度（左侧填充）。
 * @param {string} text 输入字符串
 * @param {number} length 目标长度
 * @param {string} [char] 填充字符，默认 '0'
 * @returns {string}
 */
function padStart(text, length, char) {
  const s = String(text);
  const filler = char === undefined ? '0' : char;
  if (s.length >= length) return s;
  let out = s;
  while (out.length < length) out = filler + out;
  return out;
}

/**
 * 去除首尾空白，并把中间连续空白折叠为单个空格。
 * @param {string} text 输入字符串
 * @returns {string}
 */
function normalizeSpace(text) {
  return String(text).trim().replace(/\s+/g, ' ');
}

module.exports = { escapeRegExp, truncate, toCamelCase, padStart, normalizeSpace };
