type Ok<T> = { _tag: 'Ok'; value: T }
type Err<E> = { _tag: 'Err'; error: E }

export const ok = <T, E>(value: T): Result<T, E> => ({ _tag: 'Ok', value })
export const err = <T, E>(error: E): Result<T, E> => ({ _tag: 'Err', error })

export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> => result._tag === 'Ok'
export const isErr = <T, E>(result: Result<T, E>): result is Err<E> => result._tag === 'Err'
export const match =
    <T, E, U>(onOk: (value: T) => U, onErr: (error: E) => U) =>
    (result: Result<T, E>): U => {
        if (isOk(result)) {
            return onOk(result.value)
        }
        return onErr(result.error)
    }

export const map: <T, U, E>(f: (value: T) => U) => (result: Result<T, E>) => Result<U, E> = (f) => (result) => {
    if (isOk(result)) {
        return ok(f(result.value))
    }
    return result
}

export const tap =
    <T>(fn: (value: T) => void) =>
    (value: T): T => {
        fn(value)
        return value
    }

export const mapAsync =
    <T, U, E>(f: (value: T) => U) =>
    (promise: Promise<Result<T, E>>): Promise<Result<U, E>> =>
        promise.then(map(f))

export const asyncTapOk =
    <T, E>(fn: () => void) =>
    async (promiseRes: Promise<Result<T, E>>): Promise<Result<T, E>> =>
        tap<Result<T, E>>((result) => {
            if (isOk(result)) fn()
        })(await promiseRes)

export const fromPromise = async <T, E>(
    promise: Promise<T>,
    onError: (error: unknown) => E
): Promise<Result<Awaited<T>, E>> => {
    try {
        return ok(await promise)
    } catch (error) {
        return err(onError(error))
    }
}

export type Result<T, E> = Ok<T> | Err<E>
export const Result = {
    ok,
    err,
    isOk,
    isErr,
    match,
    map,
    fromPromise,
    mapAsync,
    tapOkAsync: asyncTapOk,
    tap,
}
