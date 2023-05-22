# unwrapit

<p>
  <a href="https://npmjs.com/package/unwrapit"><img src="https://img.shields.io/npm/v/unwrapit.svg" alt="npm package"></a>
</p>

`unwrapit` is a graceful way to handle errors in TypeScript.

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
const ret = (await wrap(promise)).unwrap()
```

### Check before use

Normally, you should check your value if succeed or not, then handle your
errors. In this case, you can do this

```ts
import { wrap } from 'unwrapit'

const promise = new Promise<string>((resolve, reject) => {
  if (Math.random() < 0.5) return resolve('Yay')
  return reject(new Error('Random number is greater than 0.5.'))
})

const ret = await wrap(promise)

if (!ret.ok) {
  console.error(ret.error)
  throw ret.error
}

ret.value
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
ret.unwrap()
```

### For rxjs

If you are using `rxjs`, you can use the built-in operator `toWrap` to wrap the
result into `Result` type.

```ts
import { from, map } from 'rxjs'
import { toWrap } from 'unwrapit'

from([1, 2, 3])
  .pipe(
    map((x) => {
      if (x % 2 === 0) throw new Error(`num ${x} is even.`)
      return x
    }),
    toWrap()
  )
  .subscribe((x) => {
    if (!x.ok) return console.error(x.error) // Error: num 2 is even.
    console.log(x.value)
  })
```

## API

### `unwrap`

Try to get the value, panic when error occurs.

```ts
const wrapper = await wrap(Promise.resolve(1))
const json = wrapper.unwrap() // 1
```

If the unwrapped value is an error, it will throw error, in Node.js, it will
exit the program. If you don't want to terminate the program, you can pass
`{panic: false}` explicitly.

```ts
// this won't exit the program in Node.js
wrap(() => throw new Error('some error')).unwrap({panic: false})
```

### `unwrapOr`

Use an alternative value when error occurs.

```ts
const wrapper = await wrap(Promise.reject('error'))
const json = wrapper.unwrapOr(1) // 1
```

### `expect`

Provide a customized error message when error occurs.

```ts
const wrapper = await wrap(Promise.reject('error'))
const json = wrapper.expect('error message') // panic!
// error message
// [Cause] error
```

### `setPanic`

Use `setPanic` to set your customized panic function. This is useful when you
want to handle your customized errors by yourself.

Panic function should follow the below type definition

```ts
type PanicOption = {
  cause?: any
  exitCode?: number
  shouldExit?: boolean
}

type Panic = (message: any, opt?: PanicOption | undefined) => never
```

By default, it will use the `panic` from
[`panicit`](https://github.com/musicq/panicit).

Here's an example

```ts
import { setPanic } from 'unwrapit'
import type { Panic } from 'unwrapit'

class MyError extends Error {}

setPanic((msg: string) => {
  throw new MyError(msg)
})
```
