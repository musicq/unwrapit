# Result Flow

The central type in `unwrapit` is:

```ts
type Result<T, E = unknown> = Ok<T, E> | Err<E, T>
```

Every result has an `ok` discriminator.

```ts
import {wrap} from 'unwrapit'

const result = wrap(() => JSON.parse('{"ok":true}'))()

if (result.ok) {
  result.value
} else {
  result.error
}
```

## Success values

Use `ok(value)` when you already have a successful value.

```ts
import {ok} from 'unwrapit'

const result = ok(1)

result.ok // true
result.value // 1
```

## Error values

Use `err(error)` when you already have an error value.

```ts
import {err} from 'unwrapit'

const result = err(new Error('No user found'))

result.ok // false
result.error.message // No user found
```

## Total handling with match

`match` is a compact way to convert both cases into one final value.

```ts
const label = result.match({
  Ok: value => `Value: ${value}`,
  Err: error => `Error: ${String(error)}`,
})
```

Provide both handlers when the result has not already been narrowed. A single
handler is most useful after an `if (result.ok)` check or another narrowing step.
