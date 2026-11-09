# js-common-utils

零依赖的 JavaScript 通用工具集，只提供与具体业务无关的基础操作：数组、对象、函数节流、数值、字符串、异步流程与事件分发。

## 项目说明

- **语言与形态**：纯 JavaScript（CommonJS），未编译、未加密、未压缩、未混淆，仓库内即为可直接阅读的源码。
- **依赖**：零第三方依赖，仅使用语言内置对象（`Set`、`WeakMap`、`Promise`、`JSON`）。
- **适用范围**：通用工具层。源码仅包含上表所列的基础操作，不含领域数据、界面文案、账号体系、平台专属接口与网络地址。
- **运行环境**：Node.js 14+；浏览器与小游戏项目可直接拷贝 `src/` 下的单个模块按需引用。
- **源码注释**：每个公开函数均有 JSDoc 说明用途、参数与返回值；关键实现处附复杂度或行为说明。

## 目录

| 路径 | 内容 |
| --- | --- |
| `index.js` | 统一入口，按命名空间导出全部模块 |
| `src/array.js` | 去重、切分、扁平化、分组、交集 |
| `src/object.js` | 普通对象判断、路径读写、键筛选、深拷贝、浅合并 |
| `src/function.js` | 防抖、节流、单次执行、结果缓存 |
| `src/math.js` | 区间限制、线性插值、精度舍入、随机整数、均值、浮点比较 |
| `src/string.js` | 正则转义、截断、命名转换、补齐、空白归一 |
| `src/async.js` | 等待、超时、重试、并发限制、Promise 包装 |
| `src/event-bus.js` | 独立实例的事件订阅与分发 |
| `test/run.js` | 零依赖自测脚本 |

## 引用方式

```js
// 整包引用
const utils = require('js-common-utils');
utils.array.chunk([1, 2, 3, 4, 5], 2);      // [[1,2],[3,4],[5]]
utils.math.clamp(12, 0, 10);                 // 10
utils.string.toCamelCase('user_name');       // 'userName'

// 只引用单个模块
const { createEventBus } = require('./src/event-bus');
const bus = createEventBus();
bus.on('change', (value) => console.log(value));
bus.emit('change', 42);
```

## 模块速查

| 命名空间 | 函数 |
| --- | --- |
| `array` | `unique` `chunk` `flattenOne` `groupBy` `intersection` |
| `object` | `isPlainObject` `get` `set` `pick` `omit` `deepClone` `merge` |
| `fn` | `debounce` `throttle` `once` `memoize` |
| `math` | `clamp` `lerp` `roundTo` `randomInt` `mean` `nearlyEqual` |
| `string` | `escapeRegExp` `truncate` `toCamelCase` `padStart` `normalizeSpace` |
| `async` | `sleep` `withTimeout` `retry` `mapLimit` `toPromise` |
| `eventBus` | `createEventBus`（返回 `on` `once` `off` `emit` `clear` `listenerCount`） |

## 自测

```sh
node test/run.js
```

输出全部断言组通过即表示模块行为符合预期。

## 版本

当前版本 `1.0.0`。发布版本以 GitHub Release 形式提供，Release 与其对应标签长期保留，不做删除。

## 许可

MIT，见 [LICENSE](LICENSE)。
