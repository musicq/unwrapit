# ok

`ok` creates a successful `Result`.

```ts
import {ok} from 'unwrapit'

const result = ok(1)

result.ok // true
result.value // 1
```

Signature:

```ts
function ok<T>(value: T): Result<T, never>
```

Use it when your own function already knows the operation succeeded and wants to
return the same shape as `wrap`.
