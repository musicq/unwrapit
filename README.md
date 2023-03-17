# unwrapit

`unwrapit` is a simulation of Rust Result.

## Getting start

```shell
npm i unwrapit
```

## Usage

```ts
import { wrap } from 'unwrapit'

const asyncRet = wrap(new Promise<number>((r, j) => r(1))).unwrap() // 1
const syncRet = wrap((): string => JSON.parse('123'))().unwrap() // 123
```

```ts
import { ok, err } from 'unwrapit'

const promise = new Promise((r, j) => j('err')).then(ok).then(err)
promise.unwrap() // throw error
```
