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
  handler: {Ok: (value: T) => U; Err: (error: E) => U}
): U

match<U>(
  handler: {Ok: (value: T) => U} | {Err: (error: E) => U}
): U // deprecated
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

Single-branch handlers are supported for backward compatibility, but are
deprecated. If the result represents the omitted branch, the runtime value is
`undefined`. Prefer handling both branches, even when the result was narrowed,
so the code remains total and will be ready for the next major version.

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

For general application code, always prefer the two-handler form.
