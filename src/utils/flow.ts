export function flow<A, B>(fn1: (arg: A) => B): (arg: A) => B
export function flow<A, B, C>(fn1: (arg: A) => B, fn2: (arg: B) => C): (arg: A) => C
export function flow<A, B, C, D>(fn1: (arg: A) => B, fn2: (arg: B) => C, fn3: (arg: C) => D): (arg: A) => D
export function flow<A, B, C, D, E>(
    fn1: (arg: A) => B,
    fn2: (arg: B) => C,
    fn3: (arg: C) => D,
    fn4: (arg: D) => E
): (arg: A) => E
export function flow(...fns: Array<(arg: any) => any>): (arg: any) => any {
    return (value) => fns.reduce((acc, fn) => fn(acc), value)
}
