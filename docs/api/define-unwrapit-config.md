# defineUnwrapitConfig

`defineUnwrapitConfig` updates global `unwrapit` behavior.

```ts
import {defineUnwrapitConfig} from 'unwrapit'

defineUnwrapitConfig({
  panic: true,
})
```

Signature:

```ts
function defineUnwrapitConfig(config: Partial<WrapConfig>): void
```

## Options

```ts
type WrapConfig = {
  panic: boolean
  panicFn: Panic
}
```

`panic` controls whether `unwrap()` and `expect()` request process exit when a
result is an error. Per-call `WrapOption` values override the global config.

`panicFn` replaces the panic implementation.

```ts
defineUnwrapitConfig({
  panicFn(message, options) {
    console.error(message, options?.cause)
    throw new Error(String(message))
  },
})
```

## Compatibility exports

`defineWrapConfig` and `setPanic` are deprecated compatibility exports. Prefer
`defineUnwrapitConfig` for new code.
