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

export const match =
    <T, U>(isSomeFn: (value: T) => U, isNoneFn: () => U) =>
    (option: Option<T>): U => {
        if (isSome(option)) {
            return isSomeFn(option.value)
        }
        return isNoneFn()
    }

export const fromNullable = <T>(value: T | null | undefined): Option<T> => {
    if (value === null || value === undefined) {
        return none
    }
    return some(value)
}

export type Option<T> = Some<T> | None
export const Option = {
    some,
    none,
    isSome,
    isNone,
    map,
    match,
    fromNullable,
}
