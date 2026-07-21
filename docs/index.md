# unwrapit

`unwrapit` turns throwing JavaScript and TypeScript functions and rejected
promises into typed `Result` values with one small `wrap()` API. It is designed
as a thin exception-boundary adapter, so you can migrate away from scattered
`try`/`catch` blocks incrementally.

```shell
npm i unwrapit
```

```ts
import {wrap} from 'unwrapit'

async function main() {
  const getStatus = wrap(async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.status
  })

  const res = await getStatus('https://example.com')

  if (!res.ok) {
    console.error(res.error)
    return
  }

  console.log(res.value)
}

main()
```

## Why use it?

JavaScript exceptions are easy to miss because they are invisible in a function's
type. A function can look harmless from its signature, then still throw at
runtime and crash the program.

`unwrapit` makes fallible work return a `Result<T, E>` instead:

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

[Why Use It](/guide/why-use-it) walks through the original crash and
`try`/`catch` examples from the GitBook docs.

## Start here

- [Getting Started](/guide/getting-started) shows the core workflow.
- [Why Use It](/guide/why-use-it) explains the problem `unwrapit` is solving.
- [Result Flow](/guide/result-flow) explains `ok`, `err`, and narrowing.
- [API Reference](/api/wrap) documents every exported API, including `match`.
- [Maintaining Docs](/guide/maintaining-docs) explains the local and Vercel docs workflow.
