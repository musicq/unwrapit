# Return Result Directly

Not every function needs `wrap`. When you already know whether the operation
succeeded, return `ok` or `err` directly.

```ts
import {err, ok, type Result} from 'unwrapit'

type User = {
  id: string
  name: string
}

function findUser(id: string, users: User[]): Result<User, Error> {
  const user = users.find(item => item.id === id)

  if (!user) {
    return err(new Error(`User ${id} was not found`))
  }

  return ok(user)
}
```

This keeps the same handling style as wrapped functions.

```ts
const result = findUser('1', users)

if (result.ok) {
  console.log(result.value.name)
} else {
  console.error(result.error.message)
}
```
