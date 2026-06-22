# RxJS

`toWrap` converts an RxJS stream into a stream of `Result` values.

```ts
import {from, map} from 'rxjs'
import {toWrap} from 'unwrapit/rxjs'

from([1, 2, 3])
  .pipe(
    map(value => {
      if (value % 2 === 0) {
        throw new Error(`num ${value} is even`)
      }

      return value
    }),
    toWrap<number, Error>()
  )
  .subscribe(result => {
    result.match({
      Ok: value => console.log(value),
      Err: error => console.error(error.message),
    })
  })
```

The source observable's next values become `ok(value)`. A source error becomes
`err(error)` so consumers can handle failures in the same stream shape.
