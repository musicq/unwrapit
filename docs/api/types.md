# Types

`unwrapit` exports a small set of public types.

## Result

```ts
type Result<T, E = unknown> = Ok<T, E> | Err<E, T>
```

See [`Result`](/api/result).

## WrapOption

```ts
type WrapOption = {
  panic?: boolean
  exitCode?: number
}
```

`WrapOption` can be passed to `unwrap()` and `expect()`.

```ts
result.unwrap({panic: true, exitCode: 2})
```

## WrapConfig

```ts
type WrapConfig = {
  panic: boolean
  panicFn: Panic
}
```

`WrapConfig` is used by [`defineUnwrapitConfig`](/api/define-unwrapit-config).

## Panic

```ts
type Panic = typeof panic
```

`Panic` is the type of the panic function from `panicit`.
