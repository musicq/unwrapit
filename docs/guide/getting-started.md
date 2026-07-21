# Getting Started

Install `unwrapit` from npm:

```shell
npm i unwrapit
```

## Wrap a function

`wrap` converts a throwing function into a function that returns `Result`.

```ts
import {wrap} from 'unwrapit'

const parseJson = wrap(JSON.parse)
const result = parseJson('{"name":"unwrapit"}')

if (!result.ok) {
  console.error(result.error)
} else {
  console.log(result.value.name)
}
```

## Wrap an async function

Async functions return `Promise<Result<T, E>>`.

```ts
import {wrap} from 'unwrapit'

const getJson = wrap(async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
})

const result = await getJson('https://example.com/data')

if (result.ok) {
  console.log(result.value)
} else {
  console.error(result.error)
}
```

## Wrap a promise

You can also pass a promise value directly.

```ts
import {wrap} from 'unwrapit'

const result = await wrap(Promise.resolve('ready'))

console.log(result.unwrap()) // ready
```

## Wrap a plain value

Plain values become successful results.

```ts
import {wrap} from 'unwrapit'

const result = wrap({name: 'unwrapit'})

console.log(result.unwrap().name)
```

## Prefer explicit handling

`unwrap()` is useful when failure should panic, but most app code should inspect
`result.ok` or use `match`.

```ts
const message = result.match({
  Ok: value => `Loaded ${value.name}`,
  Err: error => `Failed: ${String(error)}`,
})
```
