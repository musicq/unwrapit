# unwrapOr

`unwrapOr` returns the success value, or the provided fallback when the result is
an error.

```ts
ok(1).unwrapOr(2) // 1
err<string, number>('error').unwrapOr(2) // 2
```

Signature:

```ts
unwrapOr(value: T): T
```

Use `unwrapOr` when the fallback is cheap to create.
