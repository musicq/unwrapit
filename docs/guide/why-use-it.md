# Why Use It

Handling errors is rarely as simple as it looks. Two common problems make
JavaScript and TypeScript error handling awkward: unexpected crashes and
repetitive `try`/`catch` blocks.

## Unexpected crashes

It is common to call functions written by teammates or imported from npm
packages.

```ts
import {plusOne} from 'lib'

// plusOne(a: number) => number

function handler() {
  const ret = plusOne(1)

  console.log(ret)
}
```

The handler is tiny, but it can still crash the program. The signature of
`plusOne` does not tell you whether it throws.

```ts
function plusOne(a: number) {
  if (a % 2 === 0) {
    throw new Error('Given number is even.')
  }

  return a + 1
}
```

Even if you try to encode that possibility in the return type, TypeScript does
not force callers to handle the thrown error.

```ts
function plusOne(a: number): never | number {
  if (a % 2 === 0) {
    throw new Error('Given number is even.')
  }

  return a + 1
}

const ret = plusOne(1)
//    ^? const ret: number
```

If this still feels abstract, replace `plusOne` with `JSON.parse`. Its return
type tells you what successful parsing returns, but it does not make parse
failures visible at the call site.

When docs are incomplete, tests miss a branch, or a function throws in a path
you did not expect, the program can fail far away from the line that caused it.

With `unwrapit`, the failure becomes a value you have to inspect.

```ts
import {wrap} from 'unwrapit'
import {plusOne} from 'lib'

const safePlusOne = wrap(plusOne)

function handler() {
  const ret = safePlusOne(1)

  if (!ret.ok) {
    console.error('error occurs', ret.error)
    return
  }

  console.log(ret.value)
}
```

When you know the error type, use the curried `wrap<Error>()(fn)` form so
TypeScript can still infer the wrapped function's parameters and success value.
See [Type annotations](/api/wrap#type-annotations) for the full pattern.

## Try/catch noise

Now consider a flow where each async step depends on the previous one. You might
want a different error message for each failure and an early return when
anything goes wrong.

```ts
import {getUser, getNewsForUser, getRelatedNews} from 'lib'

async function handler(userInfo: {username: string; pwd: string}) {
  let user

  try {
    user = await getUser(userInfo)
  } catch {
    console.error('cannot get user')
    return {err: 'cannot get user'}
  }

  let news

  try {
    news = await getNewsForUser(user.id)
  } catch {
    console.error('cannot get news for user')
    return {err: 'cannot get news for user'}
  }

  let relatedNews

  try {
    relatedNews = await getRelatedNews(news)
  } catch {
    console.error('cannot get related news')
    return {err: 'cannot get related news'}
  }

  return {data: {news, relatedNews}}
}
```

This works, but the actual happy path is buried between repeated
`try`/`catch` blocks. The code has to allocate mutable variables before each
step, then fill them inside each block.

## Just unwrapit

The idea behind `unwrapit` is inspired by Rust's `Result` style. Instead of
letting errors escape unexpectedly, wrap the fallible function and return a box:
`Ok` for the value or `Err` for the error. Then the caller unwraps or handles
that box explicitly.

```ts
import {wrap} from 'unwrapit'
import {getUser, getNewsForUser, getRelatedNews} from 'lib'

const safeGetUser = wrap(getUser)
const safeGetNewsForUser = wrap(getNewsForUser)
const safeGetRelatedNews = wrap(getRelatedNews)

async function handler(userInfo: {username: string; pwd: string}) {
  const user = await safeGetUser(userInfo)

  if (!user.ok) {
    console.error('cannot get user', user.error)
    return {err: 'cannot get user'}
  }

  const news = await safeGetNewsForUser(user.value.id)

  if (!news.ok) {
    console.error('cannot get news for user', news.error)
    return {err: 'cannot get news for user'}
  }

  const relatedNews = await safeGetRelatedNews(news.value)

  if (!relatedNews.ok) {
    console.error('cannot get related news', relatedNews.error)
    return {err: 'cannot get related news'}
  }

  return {
    data: {
      news: news.value,
      relatedNews: relatedNews.value,
    },
  }
}
```

The flow is still explicit, but now each fallible call returns the same shape:

- `result.ok` tells TypeScript which branch you are in.
- `result.value` exists on successful results.
- `result.error` exists on failed results.
- `unwrap`, `unwrapOr`, `unwrapOrElse`, `mapErr`, and `match` give you helpers
  for different handling styles.

For shorter expression-style handling, `match` can convert both branches into a
single value.

```ts
const message = user.match({
  Ok: value => `Hello ${value.name}`,
  Err: error => `Unable to load user: ${String(error)}`,
})
```

Head to [Result Flow](/guide/result-flow) for the core `Result` shape, or
[Recipes](/recipes/export-wrapped-functions) for longer usage patterns.
