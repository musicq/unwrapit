# unwrapit

`unwrapit` provides a graceful way to handle errors in JavaScript and TypeScript.
It wraps values, promises, and functions in a `Result` object so success and
failure paths stay explicit.

```shell
npm i unwrapit
```

```ts
import {wrap} from 'unwrapit'

async function main() {
  const get = wrap(fetch)
  const res = await get('https://example.com')

  if (!res.ok) {
    console.error(res.error)
    return
  }

  console.log(res.value.status)
}

main()
```

## Why use it?

JavaScript exceptions are easy to miss because they are invisible in a function's
type. `unwrapit` makes fallible work return a `Result<T, E>` instead:

```ts
const parseJson = wrap(JSON.parse)
const result = parseJson('{"package":"unwrapit"}')

const name = result.match({
  Ok: value => value.package,
  Err: error => {
    console.error(error)
    return 'unknown'
  },
})
```

## Start here

- [Getting Started](/guide/getting-started) shows the core workflow.
- [Result Flow](/guide/result-flow) explains `ok`, `err`, and narrowing.
- [API Reference](/api/wrap) documents every exported API, including `match`.
- [Maintaining Docs](/guide/maintaining-docs) explains the local and Vercel docs workflow.
