# Result

`Result` is a discriminated union of success and failure values.

```ts
type Result<T, E = unknown> = Ok<T, E> | Err<E, T>
```

## Narrow with ok

```ts
function print(result: Result<number, Error>) {
  if (result.ok) {
    console.log(result.value)
    return
  }

  console.error(result.error.message)
}
```

## Available methods

Every `Result` supports:

- [`unwrap`](/api/unwrap)
- [`unwrapOr`](/api/unwrap-or)
- [`unwrapOrElse`](/api/unwrap-or-else)
- [`expect`](/api/expect)
- [`mapErr`](/api/map-err)
- [`match`](/api/match)

The `Ok` variant has `ok: true` and `value`. The `Err` variant has `ok: false`
and `error`.
