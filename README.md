# unwrapit

<p>
  <a href="https://npmjs.com/package/unwrapit"><img src="https://img.shields.io/npm/v/unwrapit.svg" alt="npm package"></a>
</p>

`unwrapit` is a graceful way to handle errors in TypeScript.

## Documentation

https://musicq.gitbook.io/unwrapit/

## Getting start

```shell
npm i unwrapit
```

## Usage

```ts
import {wrap} from 'unwrapit'

async function main() {
  const get = wrap(fetch)
  const res = await get('https://google.com')

  console.log(res.unwrap().status)
}

main()
```
