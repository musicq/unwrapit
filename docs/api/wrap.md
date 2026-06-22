# wrap

`wrap` is the main entry point. It wraps functions, promises, and plain values
into `Result` objects.

```ts
import {wrap} from 'unwrapit'
```

## Wrap a sync function

```ts
const parseJson = wrap(JSON.parse)
const result = parseJson('{"name":"unwrapit"}')

if (result.ok) {
  console.log(result.value.name)
} else {
  console.error(result.error)
}
```

Signature:

```ts
function wrap<A extends any[], R>(
  fn: (...args: A) => R
): (...args: A) => Result<R>
```

## Wrap an async function

```ts
const get = wrap(fetch)
const result = await get('https://example.com')
```

Signature:

```ts
function wrap<A extends any[], R>(
  fn: (...args: A) => Promise<R>
): (...args: A) => Promise<Result<Awaited<R>>>
```

## Wrap a promise

```ts
const result = await wrap(Promise.resolve(1))
```

Signature:

```ts
function wrap<E, T>(promise: Promise<T>): Promise<Result<T, E>>
```

## Wrap a plain value

```ts
const result = wrap(1)

result.unwrap() // 1
```

Signature:

```ts
function wrap<T>(value: T): Result<T, never>
```

## Type annotations

TypeScript does not track thrown error types. Because of that, `wrap(fn)` infers
the success value but uses `unknown` for the error type.

```ts
const get = wrap(fetch)
const result = await get('https://example.com')
//    ^? Result<Response, unknown>
```

When you know the error type, use the curried form. This is the ergonomic
workaround for TypeScript's generic inference limitation: you provide the error
type first, then TypeScript still infers the wrapped function's parameters and
success value from the second call.

```ts
const get = wrap<TypeError>()(fetch)
const result = await get('https://example.com')
//    ^? Result<Response, TypeError>
```

`wrap()(fn)` is the same curried shape without custom types. It is mostly useful
when you want to add generics later.

```ts
const get = wrap()(fetch)
// same inferred type as wrap(fetch)
```

## Specify error and value types

Sometimes the wrapped function has a broad return type, such as `any` or
`unknown`, and you want the `Result` to carry the shape your code expects. Pass
both generics to the curried form:

```ts
type Config = {
  retries: number
}

const parseConfig = wrap<SyntaxError, Config>()(JSON.parse)
const result = parseConfig('{"retries":3}')
//    ^? Result<Config, SyntaxError>
```

This only changes the TypeScript type. It does not transform or validate the
runtime value.

The older direct generic form still works, but it is more verbose because the
function type has to be supplied as the second generic:

```ts
const parseConfig = wrap<SyntaxError, typeof JSON.parse, Config>(JSON.parse)
```
