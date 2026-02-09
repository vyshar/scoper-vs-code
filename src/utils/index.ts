export { createId } from "./id";
export { defineCommand } from "./register";

export type Result<T, E = Error> =
    | { ok: true; value: T }
    | { ok: false; error: E };

export const Ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const Err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export const match = <T, E, R>(
    result: Result<T, E>,
    handlers: { ok: (value: T) => R; err: (error: E) => R }
): R => result.ok ? handlers.ok(result.value) : handlers.err(result.error);

export const fromNullable = <T>(value: T | undefined, error: string): Result<T, string> =>
    value !== undefined ? Ok(value) : Err(error);

export const fromNullableAsync = async <T>(promise: Promise<T | undefined>, error: string): Promise<Result<T, string>> => {
    try {
        const value = await promise;
        return value !== undefined ? Ok(value) : Err(error);
    } catch (e) {
        return Err(e instanceof Error ? e.message : String(e));
    }
};

export const tryCatchAsync = async <T>(fn: () => Promise<T>): Promise<Result<T, string>> => {
    try {
        return Ok(await fn());
    } catch (e) {
        return Err(e instanceof Error ? e.message : String(e));
    }
};
