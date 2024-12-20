import {wrap as wrapv1, ok as okv1, err as errv1} from './v1.js'
import {wrap as wrapv2, ok as okv2, err as errv2} from './v2.js'

const times = 1_000_000

function parse(o) {
  return JSON.parse(o)
}

const json = JSON.stringify({name: 'mike', school: {name: 'primary', garde: 2}})
const js2 = `{name: 'mike', school: {name: 'primary', garde: 2}}`

console.time('v1 unwrap')
for (let i = 0; i < times; i++) {
  wrapv1(parse)(json).unwrap()
}
console.timeEnd('v1 unwrap')

console.time('v2 unwrap')
for (let i = 0; i < times; i++) {
  wrapv2(parse)(json).unwrap()
}
console.timeEnd('v2 unwrap')
