import {count, from, last, map, take} from 'rxjs'
import {toWrap} from '../src'

describe('toWrap function', () => {
  test('convert value to Result', () => {
    const sub$ = from([1, 2, 3]).pipe(
      map(x => {
        if (x % 2 === 0) throw new Error(`num ${x} is even.`)
        return x
      }),
      toWrap()
    )

    sub$.pipe(take(1)).subscribe(x => {
      expect(x.unwrap()).toBe(1)
    })

    sub$.pipe(count()).subscribe(x => expect(x).toBe(2))

    sub$.pipe(last()).subscribe(x => {
      if (x.ok) {
        throw new Error('This line should never be reached.')
      }

      expect(x.error).toBe('num 2 is even.')
    })

    const complete$ = from([1, 2, 3]).pipe(toWrap())
    complete$.pipe(count()).subscribe(x => expect(x).toBe(3))
    complete$.subscribe({
      next: x => expect(x.ok).toBe(true),
      // never reach
      error: () => expect(false).toBe(true),
      // will reach
      complete: () => expect(true).toBe(true),
    })
  })
})
