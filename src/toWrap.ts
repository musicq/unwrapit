import {Observable} from 'rxjs'
import type {Result} from './result'
import {err, ok} from './result'

/**
 * Convert rxjs pipe result into Result type.
 *
 * ```ts
 * import {from, map} from 'rxjs'
 * import {toWrap} from 'unwrapit'
 *
 * from([1, 2, 3]).pipe(
 *   map(x => {
 *     if (x % 2 === 0) throw new Error(`num ${x} is even.`)
 *     return x
 *   }),
 *   toWrap()
 * ).subscribe(x => {
 *   if (!x.ok) return console.error(x.error)
 *   console.log(x.value)
 * })
 * ```
 */
export function toWrap<T, E = unknown>() {
  return (observable: Observable<T>) =>
    new Observable<Result<T, E>>(subscriber => {
      const subscription = observable.subscribe({
        next(v) {
          subscriber.next(ok(v))
        },
        error(error) {
          subscriber.next(err(error))
        },
        complete() {
          subscriber.complete()
        },
      })

      return () => {
        subscription.unsubscribe()
      }
    })
}
