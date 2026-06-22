# Configuration

`unwrapit` uses a global config for panic behavior.

```ts
import {defineUnwrapitConfig} from 'unwrapit'

defineUnwrapitConfig({
  panic: true,
})
```

## Configure panic behavior

When `panic` is `false`, `unwrap()` and `expect()` use the panic function without
requesting process exit. When `panic` is `true`, they ask the panic function to
exit the process in Node.js.

```ts
import {defineUnwrapitConfig, err} from 'unwrapit'

defineUnwrapitConfig({panic: true})

err('fatal').unwrap()
```

Per-call options override the global config.

```ts
err('fatal').unwrap({panic: false})
err('fatal').expect('custom message', {panic: true, exitCode: 2})
```

## Customize the panic function

Use `panicFn` to report errors, clean up resources, or throw your own error type.

```ts
import {defineUnwrapitConfig} from 'unwrapit'

defineUnwrapitConfig({
  panicFn(message, options) {
    console.error(message, options?.cause)
    throw new Error(String(message))
  },
})
```

## Deprecated aliases

`defineWrapConfig` and `setPanic` are still exported for compatibility. Prefer
`defineUnwrapitConfig` in new code.
