# mapErr

`mapErr` transforms the error value and leaves successful values unchanged.

```ts
import {err} from 'unwrapit'

const result = err('not found').mapErr(message => new Error(message))
```

Signature:

```ts
mapErr<U>(errMapFn: (error: E) => U): Result<T, U>
```

## Example

```ts
const result = wrap(JSON.parse)('bad json').mapErr(error => ({
  type: 'parse_error' as const,
  cause: error,
}))
```

Use `mapErr` at boundaries where you want to normalize error shapes.
