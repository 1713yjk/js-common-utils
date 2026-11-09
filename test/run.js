'use strict';

/**
 * 零依赖自测脚本：node test/run.js
 * 用 Node 内置 assert 覆盖每个模块的典型与边界输入。
 * 所有断言组在同一个 async 主流程中顺序执行，异步失败会被统一捕获。
 */

const assert = require('assert');
const lib = require('../index');

let passed = 0;
async function check(name, fn) {
  await fn();
  passed += 1;
  console.log('  ok  ' + name);
}

async function main() {
  console.log('js-common-utils v' + lib.version + ' 自测开始\n');

  await check('array.unique 保序去重', function () {
    assert.deepStrictEqual(lib.array.unique([3, 1, 3, 2, 1]), [3, 1, 2]);
  });
  await check('array.chunk 定长切分', function () {
    assert.deepStrictEqual(lib.array.chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
  });
  await check('array.flattenOne 只展开一层', function () {
    assert.deepStrictEqual(lib.array.flattenOne([1, [2, [3]], 4]), [1, 2, [3], 4]);
  });
  await check('array.groupBy 按键分组', function () {
    const r = lib.array.groupBy([1, 2, 3, 4], function (n) { return n % 2; });
    assert.deepStrictEqual(r['0'], [2, 4]);
    assert.deepStrictEqual(r['1'], [1, 3]);
  });
  await check('array.intersection 交集', function () {
    assert.deepStrictEqual(lib.array.intersection([1, 2, 2, 3], [2, 3, 4]), [2, 3]);
  });

  await check('object.isPlainObject 类型判断', function () {
    assert.strictEqual(lib.object.isPlainObject({}), true);
    assert.strictEqual(lib.object.isPlainObject([]), false);
    assert.strictEqual(lib.object.isPlainObject(null), false);
  });
  await check('object.get 路径读取与默认值', function () {
    const o = { a: { b: { c: 7 } } };
    assert.strictEqual(lib.object.get(o, 'a.b.c'), 7);
    assert.strictEqual(lib.object.get(o, 'a.x.y', 'fallback'), 'fallback');
  });
  await check('object.set 自动补齐中间层', function () {
    const o = {};
    lib.object.set(o, 'a.b.c', 9);
    assert.strictEqual(o.a.b.c, 9);
  });
  await check('object.pick / omit 键筛选', function () {
    const o = { a: 1, b: 2, c: 3 };
    assert.deepStrictEqual(lib.object.pick(o, ['a', 'c']), { a: 1, c: 3 });
    assert.deepStrictEqual(lib.object.omit(o, ['b']), { a: 1, c: 3 });
  });
  await check('object.deepClone 处理循环引用', function () {
    const o = { n: 1, list: [1, { k: 2 }] };
    o.self = o;
    const copy = lib.object.deepClone(o);
    assert.notStrictEqual(copy, o);
    assert.strictEqual(copy.list[1].k, 2);
    assert.strictEqual(copy.self, copy);
  });
  await check('object.merge 覆盖顺序', function () {
    assert.deepStrictEqual(lib.object.merge({ a: 1 }, { a: 2, b: 3 }), { a: 2, b: 3 });
  });

  await check('function.once 只执行一次', function () {
    let n = 0;
    const f = lib.fn.once(function () { n += 1; return n; });
    assert.strictEqual(f(), 1);
    assert.strictEqual(f(), 1);
  });
  await check('function.memoize 结果缓存', function () {
    let calls = 0;
    const f = lib.fn.memoize(function (a, b) { calls += 1; return a + b; });
    assert.strictEqual(f(1, 2), 3);
    assert.strictEqual(f(1, 2), 3);
    assert.strictEqual(calls, 1);
  });
  await check('function.debounce 只执行最后一次', async function () {
    let n = 0;
    const f = lib.fn.debounce(function (v) { n = v; }, 15);
    f(1); f(2); f(3);
    await new Promise(function (r) { setTimeout(r, 40); });
    assert.strictEqual(n, 3);
  });
  await check('function.debounce.cancel 取消待执行', async function () {
    let n = 0;
    const f = lib.fn.debounce(function () { n += 1; }, 15);
    f();
    f.cancel();
    await new Promise(function (r) { setTimeout(r, 40); });
    assert.strictEqual(n, 0);
  });
  await check('function.throttle 窗口内只触发一次', function () {
    let n = 0;
    const f = lib.fn.throttle(function () { n += 1; }, 1000);
    f(); f(); f();
    assert.strictEqual(n, 1);
  });

  await check('math.clamp / lerp / roundTo', function () {
    assert.strictEqual(lib.math.clamp(12, 0, 10), 10);
    assert.strictEqual(lib.math.lerp(0, 10, 0.25), 2.5);
    assert.strictEqual(lib.math.roundTo(3.14159, 2), 3.14);
  });
  await check('math.mean 空数组返回 0', function () {
    assert.strictEqual(lib.math.mean([]), 0);
    assert.strictEqual(lib.math.mean([1, 2, 3]), 2);
  });
  await check('math.nearlyEqual 误差比较', function () {
    assert.strictEqual(lib.math.nearlyEqual(0.1 + 0.2, 0.3), true);
  });
  await check('math.randomInt 落在闭区间', function () {
    for (let i = 0; i < 50; i += 1) {
      const v = lib.math.randomInt(1, 3);
      assert.ok(v >= 1 && v <= 3);
    }
  });

  await check('string.escapeRegExp 特殊字符转义', function () {
    assert.strictEqual(lib.string.escapeRegExp('a.b*c'), 'a\\.b\\*c');
  });
  await check('string.truncate 截断', function () {
    assert.strictEqual(lib.string.truncate('abcdefgh', 6), 'abc...');
  });
  await check('string.toCamelCase 命名转换', function () {
    assert.strictEqual(lib.string.toCamelCase('user_name first-name'), 'userNameFirstName');
  });
  await check('string.padStart / normalizeSpace', function () {
    assert.strictEqual(lib.string.padStart('7', 3), '007');
    assert.strictEqual(lib.string.normalizeSpace('  a   b  '), 'a b');
  });

  await check('eventBus 订阅 / 触发 / once / off / clear', function () {
    const bus = lib.eventBus.createEventBus();
    let a = 0, b = 0;
    bus.on('tick', function () { a += 1; });
    bus.once('tick', function () { b += 1; });
    bus.emit('tick');
    bus.emit('tick');
    assert.strictEqual(a, 2);
    assert.strictEqual(b, 1);
    bus.clear();
    assert.strictEqual(bus.listenerCount('tick'), 0);
  });
  await check('eventBus 单个订阅者抛错不影响其余', function () {
    const bus = lib.eventBus.createEventBus();
    const original = console.error;
    console.error = function () {}; // 静默预期内的错误日志
    try {
      let reached = false;
      bus.on('x', function () { throw new Error('boom'); });
      bus.on('x', function () { reached = true; });
      bus.emit('x');
      assert.strictEqual(reached, true);
    } finally {
      console.error = original;
    }
  });

  await check('async.sleep 等待', async function () {
    const t = Date.now();
    await lib.async.sleep(20);
    assert.ok(Date.now() - t >= 15);
  });
  await check('async.withTimeout 正常返回', async function () {
    assert.strictEqual(await lib.async.withTimeout(Promise.resolve(42), 100), 42);
  });
  await check('async.withTimeout 超时拒绝', async function () {
    await assert.rejects(lib.async.withTimeout(new Promise(function () {}), 20));
  });
  await check('async.retry 失败后重试成功', async function () {
    let n = 0;
    const value = await lib.async.retry(function () {
      n += 1;
      return n < 3 ? Promise.reject(new Error('again')) : Promise.resolve('done');
    }, { retries: 3, delay: 1 });
    assert.strictEqual(value, 'done');
    assert.strictEqual(n, 3);
  });
  await check('async.mapLimit 保序且限制并发', async function () {
    let active = 0, peak = 0;
    const out = await lib.async.mapLimit([1, 2, 3, 4, 5, 6], 2, async function (x) {
      active += 1;
      peak = Math.max(peak, active);
      await lib.async.sleep(5);
      active -= 1;
      return x * 2;
    });
    assert.deepStrictEqual(out, [2, 4, 6, 8, 10, 12]);
    assert.ok(peak <= 2, '并发数不应超过 limit');
  });
  await check('async.toPromise 包装普通值', async function () {
    assert.strictEqual(await lib.async.toPromise(5), 5);
  });

  console.log('\n全部通过，共 ' + passed + ' 项断言组');
}

main().catch(function (err) {
  console.error('\n自测失败:', err);
  process.exit(1);
});
