# err

`err` creates a failed `Result`.

```ts
import {err} from 'unwrapit'

const result = err(new Error('Not found'))

result.ok // false
result.error.message // Not found
```

Signature:

```ts
function err<E = unknown, T = unknown>(error: E): Result<T, E>
```

Use it when your own function wants to return a failure without throwing.
