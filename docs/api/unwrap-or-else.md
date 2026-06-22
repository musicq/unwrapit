# unwrapOrElse

`unwrapOrElse` returns the success value, or maps the error into a fallback
value.

```ts
import {err} from 'unwrapit'

const value = err<string, number>('error').unwrapOrElse(error => error.length)

value // 5
```

Signature:

```ts
unwrapOrElse<U>(mapFn: (error: E) => U): T | U
```

Use `unwrapOrElse` when the fallback depends on the error or is expensive to
create.
