# toWrap

`toWrap` converts an RxJS observable into an observable of `Result` values.

```ts
import {from, map} from 'rxjs'
import {toWrap} from 'unwrapit/rxjs'

const results$ = from([1, 2, 3]).pipe(
  map(value => {
    if (value === 2) {
      throw new Error('two is not allowed')
    }

    return value
  }),
  toWrap<number, Error>()
)
```

Signature:

```ts
function toWrap<T, E = unknown>(): (
  observable: Observable<T>
) => Observable<Result<T, E>>
```

Values from the source observable become `ok(value)`. Errors from the source
observable become `err(error)`.
