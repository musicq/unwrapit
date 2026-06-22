# Export Wrapped Functions

You can wrap a function once and export the safe version.

```ts
import {wrap} from 'unwrapit'

async function loadUser(id: string) {
  const response = await fetch(`/users/${id}`)

  if (!response.ok) {
    throw new Error(`Unable to load user ${id}`)
  }

  return response.json() as Promise<{id: string; name: string}>
}

export const safeLoadUser = wrap<Error, typeof loadUser>(loadUser)
```

Consumers receive a `Result` instead of needing their own `try`/`catch`.

```ts
const result = await safeLoadUser('1')

result.match({
  Ok: user => console.log(user.name),
  Err: error => console.error(error.message),
})
```
