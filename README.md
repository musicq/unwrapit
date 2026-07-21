# unwrapit

<p>
  <a href="https://npmjs.com/package/unwrapit"><img src="https://img.shields.io/npm/v/unwrapit.svg" alt="npm package"></a>
  <a href="https://github.com/musicq/unwrapit/actions/workflows/ci.yml"><img src="https://github.com/musicq/unwrapit/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://bundlephobia.com/package/unwrapit"><img src="https://img.shields.io/bundlephobia/minzip/unwrapit" alt="minified and gzipped size"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/unwrapit" alt="MIT license"></a>
</p>

**Turn throwing functions and rejected promises into typed `Result` values with
one `wrap()` API.**

`unwrapit` is a small exception-boundary adapter for JavaScript and TypeScript.
It catches sync throws and async rejections, then returns a discriminated
`Result<T, E>` instead of letting the error escape.

- One `wrap()` API for sync functions, async functions, promises, and values.
- Familiar `result.ok`, `result.value`, and `result.error` narrowing.
- Less than 1 kB minified and gzipped.
- Optional RxJS operator available from `unwrapit/rxjs`.

## Documentation

Read the [documentation](https://unwrapit-js.vercel.app/), or preview its
source locally:

```shell
pnpm run docs:dev
```

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

const getJson = wrap(async (url: string) => {
  const response = await fetch(url)

  // fetch does not reject for HTTP error statuses, so make that failure explicit.
  if (!response.ok) {
    throw new Error(`Request failed with HTTP ${response.status}`)
  }

  return response.json()
})

const result = await getJson('https://api.example.com/data')

if (result.ok) {
  console.log(result.value)
} else {
  console.error(result.error)
}
```

## Is unwrapit a good fit?

Use `unwrapit` when you want to add an explicit error boundary around existing
throwing APIs without adopting a larger functional-programming toolkit. Its
main job is making migration from `try`/`catch` small and incremental.

If your application needs a comprehensive Result ecosystem with extensive
composition operators, a larger library such as
[`neverthrow`](https://github.com/supermacro/neverthrow) may be a better fit.

## API

### `wrap`

The core function. It wraps functions, promises, or plain values and returns a `Result` type that is either `Ok` or `Err`.

#### Wrap a function

Wrapping a function returns a new function with the same signature, but the return value is wrapped in a `Result`.

```ts
import { wrap } from 'unwrapit'

// Sync function
const safeParse = wrap(JSON.parse)
const parseResult = safeParse('invalid json') // Result<any, unknown>

// Async function
const safeFetch = wrap(async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response
})

const fetchResult = await safeFetch('https://example.com') // Result<Response, unknown>
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

Single-branch handlers remain available for backward compatibility, but are
deprecated because an omitted branch can produce `undefined` at runtime:

```ts
ok(1).match({ Ok: v => v * 2 })   // 2
err('x').match({ Err: e => e.length }) // 1
```

Prefer passing both `Ok` and `Err` handlers.

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
