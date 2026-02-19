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

export const mapErr =
    <T, E, F>(f: (error: E) => F) =>
    (result: Result<T, E>): Result<T, F> => {
        if (isErr(result)) {
            return err(f(result.error))
        }
        return result as unknown as Result<T, F>
    }

export const flatMap =
    <T, U, E>(f: (value: T) => Result<U, E>) =>
    (result: Result<T, E>): Result<U, E> => {
        if (isOk(result)) {
            return f(result.value)
        }
        return result as unknown as Result<U, E>
    }

export const mapAsync =
    <T, U, E>(f: (value: T) => U) =>
    (promise: Promise<Result<T, E>>): Promise<Result<U, E>> =>
        promise.then(map(f))

export const flatMapAsync =
    <T, U, E>(f: (value: T) => Promise<Result<U, E>>) =>
    (promise: Promise<Result<T, E>>): Promise<Result<U, E>> =>
        promise.then((result) => {
            if (isOk(result)) {
                return f(result.value)
            }
            return Promise.resolve(result as unknown as Result<U, E>)
        })

export const asyncTapOk =
    <T, E>(fn: () => void | Promise<void>) =>
    async (promiseRes: Promise<Result<T, E>>): Promise<Result<T, E>> => {
        const result = await promiseRes
        if (isOk(result)) await fn()
        return result
    }

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
    mapErr,
    flatMap,
    mapAsync,
    flatMapAsync,
    fromPromise,
    tapOkAsync: asyncTapOk,
}
