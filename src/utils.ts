export function isPromiseLike(input: any): boolean {
  return 'then' in input && typeof input.then === 'function'
}
