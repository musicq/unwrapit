# expect

`expect` returns the success value. If the result is an error, it calls the
configured panic function with your custom message and the original error as the
cause.

```ts
const value = result.expect('Expected user to exist')
```

Signature:

```ts
expect(errorMessage: string, opt?: WrapOption): T | never
```

## Example

```ts
import {err} from 'unwrapit'

err('database offline').expect('Unable to load user')
```

## Panic options

```ts
result.expect('Unable to load user', {
  panic: true,
  exitCode: 2,
})
```
