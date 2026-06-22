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

## Specify an error type

Use generics when you know the error shape and want the result type to carry it.

```ts
const parseJson = wrap<SyntaxError, typeof JSON.parse>(JSON.parse)
const result = parseJson('bad json')
```
