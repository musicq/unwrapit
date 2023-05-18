import {Observable} from 'rxjs'
import type {Result} from './result'
import {err, ok} from './result'

export function toWrap<T, E = unknown>() {
  return (observable: Observable<T>) =>
    new Observable<Result<T, E>>((subscriber) => {
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
