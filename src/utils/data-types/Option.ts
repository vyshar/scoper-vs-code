type Some<T> = { _tag: 'Some'; value: T }
type None = { _tag: 'None' }

export const some = <T>(value: T): Option<T> => ({ _tag: 'Some', value })
export const none: Option<never> = { _tag: 'None' }

export const isSome = <T>(option: Option<T>): option is Some<T> => option._tag === 'Some'
export const isNone = <T>(option: Option<T>): option is None => option._tag === 'None'

export const map =
    <T, U>(fn: (value: T) => U) =>
    (option: Option<T>): Option<U> => {
        if (isSome(option)) {
            return some(fn(option.value))
        }
        return none
    }

export const flatMap =
    <T, U>(fn: (value: T) => Option<U>) =>
    (option: Option<T>): Option<U> => {
        if (isSome(option)) {
            return fn(option.value)
        }
        return none
    }

export const match =
    <T, U>(isSomeFn: (value: T) => U, isNoneFn: () => U) =>
    (option: Option<T>): U => {
        if (isSome(option)) {
            return isSomeFn(option.value)
        }
        return isNoneFn()
    }

export const getOrElse =
    <T>(fallback: T) =>
    (option: Option<T>): T => {
        if (isSome(option)) {
            return option.value
        }
        return fallback
    }

export const fromNullable = <T>(value: T | null | undefined): Option<T> => {
    if (value === null || value === undefined) {
        return none
    }
    return some(value)
}

export const whenSome =
    <T>(fn: (value: T) => void) =>
    (option: Option<T>): Option<T> => {
        if (isSome(option)) {
            fn(option.value)
        }
        return option
    }

export type Option<T> = Some<T> | None
export const Option = {
    some,
    none,
    isSome,
    isNone,
    map,
    flatMap,
    match,
    getOrElse,
    fromNullable,
    whenSome,
}
