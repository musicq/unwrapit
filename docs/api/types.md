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

## Optional

```ts
type Optional<T> = T | undefined
```

`Optional<T>` represents a value that may be `undefined`.

```ts
type OptionalUser = Optional<User>
// User | undefined
```

## Nullable

```ts
type Nullable<T> = T | null
```

`Nullable<T>` represents a value that may explicitly be `null`.

```ts
type NullableUser = Nullable<User>
// User | null
```

## Maybe

```ts
type Maybe<T> = T | undefined | null
```

`Maybe<T>` represents a value that may be either `undefined` or `null`.

```ts
type MaybeUser = Maybe<User>
// User | undefined | null
```
