type Ok<T> = { _tag: 'Ok'; value: T }
type Err<E> = { _tag: 'Err'; error: E }

export const ok = <T, E>(value: T): Result<T, E> => ({ _tag: 'Ok', value })
export const err = <T, E>(error: E): Result<T, E> => ({ _tag: 'Err', error })

export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> => result._tag === 'Ok'
export const isErr = <T, E>(result: Result<T, E>): result is Err<E> => result._tag === 'Err'
export const match = <T, E, U>(result: Result<T, E>, onOk: (value: T) => U, onErr: (error: E) => U): U => {
    if (isOk(result)) {
        return onOk(result.value)
    }
    return onErr(result.error)
}

export const fromPromise = async <T, E>(promise: Promise<T>, onError: (error: unknown) => E): Promise<Result<T, E>> => {
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
    fromPromise,
}
