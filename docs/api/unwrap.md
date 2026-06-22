# unwrap

`unwrap` returns the success value. If the result is an error, it calls the
configured panic function.

```ts
const value = result.unwrap()
```

Signature:

```ts
unwrap(opt?: WrapOption): T | never
```

## Example

```ts
import {wrap} from 'unwrapit'

const result = await wrap(Promise.resolve(1))

result.unwrap() // 1
```

## Panic options

Pass `panic: true` to request process exit in Node.js.

```ts
import {wrap} from 'unwrapit'

const result = await wrap(Promise.reject(new Error('fatal')))

result.unwrap({panic: true, exitCode: 2})
```

Use [`defineUnwrapitConfig`](/api/define-unwrapit-config) to set the default
panic behavior globally.
