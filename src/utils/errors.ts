export const ERROR_NO_ACTIVE_SCOPE = 'No active scope set.'
export const ERROR_SCOPE_NOT_FOUND = 'Scope not found.'
export const ERROR_DUPLICATE_SCOPE_NAME = 'A scope with this name already exists.'
export const ERROR_EMPTY_SCOPE_NAME = 'Scope name cannot be empty.'
export const ERROR_FILE_ALREADY_EXISTS = 'File already exists in the active scope.'
export const ERROR_FILE_ADD_FAILED = 'Failed to add file to scope.'
export const ERROR_FILE_INDEX_OUT_OF_BOUNDS = 'File index out of bounds.'
export const UNKNOWN_ERROR = 'An unknown error occurred.'

export const formatError =
    (message: string) =>
    (error: unknown): string => {
        if (error instanceof Error) {
            return `${message}: ${error.message}`
        }
        if (typeof error === 'string') {
            return `${message}: ${error}`
        }
        return `${message}: ${UNKNOWN_ERROR}`
    }
