# unwrapit

`unwrapit` is a simulation of Rust Result.

## Getting start

```shell
npm i unwrapit
```

## Usage

### Synchronous function

If you have a synchronous function, you can simply wrap your function and call
it later on.

```ts
import { wrap } from 'unwrapit'

const tryParseJson = wrap(() => JSON.parse(`{"package": "unwrapit!"}`))
// unwrap to get the value without checking if it could be failed.
const json = tryParseJson().unwrap()
```

### Asynchronous function

You can wrap a promise value as well.

```ts
import { wrap } from 'unwrapit'

const promise = new Promise<string>((resolve, reject) => {
  if (Math.random() < 0.5) return resolve('Yay')
  return reject(new Error('Random number is greater than 0.5.'))
})

// ret type is string
const ret = wrap(promise).unwrap()
```

### Check before use

Normally, you should check if your value if succeed or not, then handle your
errors. In this case, you can do this

```ts
import { wrap } from 'unwrapit'

const promise = new Promise<string>((resolve, reject) => {
  if (Math.random() < 0.5) return resolve('Yay')
  return reject(new Error('Random number is greater than 0.5.'))
})

const ret = wrap(promise)

if (!ret.ok) {
  console.error(ret.error)
  throw ret.error
}

console.log(ret.value)
```

### Use Result manually

Normally, you can just simply `wrap` your function, it has `wrap`ped with Result
automatically. But you still can use Result manually.

```ts
import { ok, err } from 'unwrapit'
import type { Result } from 'unwrapit'

const pass: Result<number, never> = ok(1)
const fail: Result<never, string> = err('error')

function fn(v: boolean): Result<number, string> {
  if (v) return ok(1)
  return err('error')
}

const ret = fn(Math.random() < 0.5)
console.log(ret.unwrap())
```
