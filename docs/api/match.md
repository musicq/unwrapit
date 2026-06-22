# match

`match` handles `Ok` and `Err` results in one expression.

```ts
const message = result.match({
  Ok: value => `Loaded ${value}`,
  Err: error => `Failed: ${String(error)}`,
})
```

Signature:

```ts
match<U>(
  handler:
    | {Ok: (value: T) => U}
    | {Err: (error: E) => U}
    | {Ok: (value: T) => U; Err: (error: E) => U}
): U
```

## Handle both cases

Provide both handlers when the result has not already been narrowed.

```ts
import {wrap} from 'unwrapit'

const result = wrap(() => JSON.parse('{"name":"unwrapit"}'))()

const name = result.match({
  Ok: value => value.name,
  Err: error => {
    console.error(error)
    return 'unknown'
  },
})
```

## Use with narrowed results

A single handler is useful when TypeScript already knows which variant you have.

```ts
if (result.ok) {
  return result.match({
    Ok: value => value.name,
  })
}

return result.match({
  Err: error => String(error),
})
```

For general application code, the two-handler form is the most predictable.
