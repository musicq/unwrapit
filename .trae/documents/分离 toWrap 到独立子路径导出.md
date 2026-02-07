## 目标

将 `toWrap`（rxjs 集成）分离到独立的子路径 `unwrapit/rxjs`，确保不使用 rxjs 的用户不会打包 rxjs 代码。

## 修改内容

### 1. 创建新的入口文件 `src/rxjs.ts`

```typescript
export {toWrap} from './toWrap'
```

### 2. 修改 `src/index.ts` - 移除 toWrap 导出

```typescript
export {panic} from 'panicit'
export {defineUnwrapitConfig, defineWrapConfig, setPanic} from './config'
export type {Panic, WrapConfig} from './config'
export {err, ok} from './result'
export type {Result, WrapOption} from './result'
export {wrap} from './wrap'
// 移除: export {toWrap} from './toWrap'
```

### 3. 修改 `package.json`

**更新构建脚本（同时构建两个入口）：**
```json
"build": "tsup src/index.ts src/rxjs.ts --dts --minify --format cjs,esm"
```

**添加子路径导出：**
```json
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "require": "./dist/index.cjs",
    "import": "./dist/index.js"
  },
  "./rxjs": {
    "types": "./dist/rxjs.d.ts",
    "require": "./dist/rxjs.cjs",
    "import": "./dist/rxjs.js"
  }
}
```

**将 rxjs 改为可选依赖：**
```json
"peerDependencies": {
  "rxjs": "^7.8.1"
},
"peerDependenciesMeta": {
  "rxjs": {
    "optional": true
  }
}
```

### 4. 更新测试文件 `tests/toWrap.test.ts`

```typescript
import {toWrap} from '../src/rxjs'  // 改为从 rxjs 入口导入
```

## 使用方式变化

**之前：**
```typescript
import {wrap, toWrap} from 'unwrapit'
```

**之后：**
```typescript
import {wrap} from 'unwrapit'
import {toWrap} from 'unwrapit/rxjs'
```

## 验证步骤

1. `npm run build` - 确保构建两个入口文件
2. `npm test` - 确保测试通过
3. 检查 `dist/` 目录确认生成了 `index.js` 和 `rxjs.js`
