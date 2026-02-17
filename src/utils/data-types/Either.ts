type Left<E> = { _tag: 'Left'; left: E }
type Right<A> = { _tag: 'Right'; right: A }

export const left = <E, A = never>(value: E): Either<E, A> => ({ _tag: 'Left', left: value })
export const right = <A, E = never>(value: A): Either<E, A> => ({ _tag: 'Right', right: value })

export const isLeft = <E, A>(either: Either<E, A>): either is Left<E> => either._tag === 'Left'
export const isRight = <E, A>(either: Either<E, A>): either is Right<A> => either._tag === 'Right'

export const match = <L, R, T>(either: Either<L, R>, onLeft: (left: L) => T, onRight: (right: R) => T): T => {
    if (isLeft(either)) {
        return onLeft(either.left)
    }
    return onRight(either.right)
}

export type Either<L, R> = Left<L> | Right<R>

export const Either = {
    left,
    right,
    isLeft,
    isRight,
    match,
}
