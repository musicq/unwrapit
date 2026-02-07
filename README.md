# unwrapit

<p>
  <a href="https://npmjs.com/package/unwrapit"><img src="https://img.shields.io/npm/v/unwrapit.svg" alt="npm package"></a>
</p>

`unwrapit` provides a way to handle errors in JS/TS gracefully and intuitively. Inspired by Rust's `Result` type, it lets you wrap functions, promises, and values so that errors are captured as values instead of thrown exceptions.

## Getting started

### Installation

```shell
npm i unwrapit
```

### Basic example

```ts
import { wrap } from 'unwrapit'

// Wrap a function that might throw
const safeParse = wrap(JSON.parse)
const result = safeParse('{"name": "unwrapit"}')

if (result.ok) {
  console.log(result.value) // { name: 'unwrapit' }
} else {
  console.error(result.error)
}
```

### Async example

```ts
import { wrap } from 'unwrapit'

const safeFetch = wrap(fetch)
const result = await safeFetch('https://api.example.com/data')

const response = result.unwrap()
const data = await response.json()
```

## API

### `wrap`

The core function. It wraps functions, promises, or plain values and returns a `Result` type that is either `Ok` or `Err`.

#### Wrap a function

Wrapping a function returns a new function with the same signature, but the return value is wrapped in a `Result`.

```ts
import { wrap } from 'unwrapit'

// Sync function
const safeParse = wrap(JSON.parse)
const result = safeParse('invalid json') // Result<any, unknown>

// Async function
const safeFetch = wrap(fetch)
const result = await safeFetch('https://example.com') // Result<Response, unknown>
```

#### Wrap a promise

```ts
import { wrap } from 'unwrapit'

const promise = fetch('https://example.com')
const result = await wrap(promise) // Result<Response, unknown>
```

#### Wrap a value

```ts
import { wrap } from 'unwrapit'

const result = wrap(42) // Result<number, never>
```

#### Specify error type

Call `wrap()` with no arguments to get a curried version where you can specify the error type:

```ts
import { wrap } from 'unwrapit'

const safeParse = wrap<SyntaxError>()(JSON.parse)
const result = safeParse('invalid') // Result<any, SyntaxError>
```

### `ok` / `err`

Create `Result` values directly.

```ts
import { ok, err } from 'unwrapit'

const success = ok(42)       // Result<number, never>
const failure = err('oops')  // Result<unknown, string>
```

### Result methods

Every `Result` value (whether from `wrap`, `ok`, or `err`) has the following methods:

#### `unwrap(opt?)`

Extract the contained value. Panics if the result is `Err`.

```ts
ok(1).unwrap()    // 1
err('x').unwrap() // panics
```

You can pass `WrapOption` to control panic behavior:

```ts
result.unwrap({ panic: true, exitCode: 2 })
```

#### `unwrapOr(defaultValue)`

Return the contained value, or a default if it is `Err`.

```ts
ok(1).unwrapOr(0)    // 1
err('x').unwrapOr(0) // 0
```

#### `unwrapOrElse(mapFn)`

Return the contained value, or compute a fallback from the error.

```ts
ok(1).unwrapOrElse(e => 0)          // 1
err('hello').unwrapOrElse(e => e.length) // 5
```

#### `expect(message, opt?)`

Extract the contained value. Panics with a custom error message if the result is `Err`.

```ts
ok(1).expect('should not fail')    // 1
err('x').expect('parsing failed')  // panics with "parsing failed"
```

#### `mapErr(fn)`

Transform the error value, leaving `Ok` untouched.

```ts
err('not found').mapErr(e => new Error(e))
// Err<Error, unknown>

ok(1).mapErr(e => new Error(String(e)))
// Ok<number> (unchanged)
```

#### `match(handler)`

Pattern match on `Ok` and `Err`.

```ts
const result = ok(1).match({
  Ok: v => v + 1,
  Err: e => 0,
}) // 2
```

You can also provide only one branch:

```ts
ok(1).match({ Ok: v => v * 2 })   // 2
err('x').match({ Err: e => e.length }) // 1
```

### `defineUnwrapitConfig(config)`

Set global configuration for `unwrapit`.

```ts
import { defineUnwrapitConfig } from 'unwrapit'

defineUnwrapitConfig({
  // Exit the program on panic (default: false)
  // In browser: throws an error. In Node: calls process.exit()
  panic: true,
  // Custom panic function
  panicFn: (msg, opts) => {
    reportError(msg)
    throw new Error(String(msg))
  },
})
```

### `panic`

Re-exported from [`panicit`](https://github.com/musicq/panicit). Throws a panic error.

```ts
import { panic } from 'unwrapit'

panic('something went wrong')
```

### RxJS integration

`unwrapit` provides a `toWrap` RxJS operator that converts observable errors into `Result` values instead of terminating the stream.

```ts
import { from, map } from 'rxjs'
import { toWrap } from 'unwrapit/rxjs'

from([1, 2, 3]).pipe(
  map(x => {
    if (x % 2 === 0) throw new Error(`${x} is even`)
    return x
  }),
  toWrap()
).subscribe(result => {
  if (!result.ok) {
    console.error(result.error)
    return
  }
  console.log(result.value)
})
```

Install `rxjs` as a peer dependency to use this feature:

```shell
npm i rxjs
```

## License

MIT
