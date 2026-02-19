import { ILocalRepository } from '@/repositories/local.repository'
import { Scope } from '@/types/Scope'
import { Option } from '@/utils/data-types/Option'
import { Result } from '@/utils/data-types/Result'
import {
    ERROR_DUPLICATE_SCOPE_NAME,
    ERROR_FILE_ALREADY_EXISTS,
    ERROR_SCOPE_NOT_FOUND,
    formatError,
} from '@/utils/errors'
import { ChangeEventEmitter } from '@/types/ChangeEventEmitter'
import { pipe } from '@/utils/pipe'

export interface IScopeService {
    /**
     * Scope operations
     */
    createScope(name: string): Promise<Result<Scope, string>>
    getScopes(): Scope[]
    getScopeByName(name: string): Option<Scope>
    getScopeById(id: string): Option<Scope>
    renameScope(scopeId: string, newName: string): Promise<Result<Scope, string>>
    deleteScope(scopeId: string): Promise<Result<void, string>>
    swapFilesInScope(scopeId: string, filePath: string, targetFilePath: string | null): Promise<Result<Scope, string>>

    /**
     * Active scope operations
     */
    getActiveScope(): Option<Scope>
    setActiveScope(scope: Scope): Promise<Result<void, string>>
    addFileToScope(scopeId: string, filePath: string): Promise<Result<Scope, string>>
    removeFileFromScope(scopeId: string, filePath: string): Promise<Result<Scope, string>>
    getScopeFiles(scopeId: string): Result<readonly string[], string>
}

export const ScopeService = (localRepository: ILocalRepository, changeEmitter: ChangeEventEmitter): IScopeService => {
    return {
        getScopeByName: (name: string) => Option.fromNullable(localRepository.getByName(name)),
        getScopes: localRepository.getAll,
        getScopeById: (id: string): Option<Scope> => Option.fromNullable(localRepository.getById(id)),
        getActiveScope: (): Option<Scope> => Option.fromNullable(localRepository.getActiveScope()),
        setActiveScope: async (scope: Scope) => {
            return pipe(
                Result.fromPromise(localRepository.setActiveScope(scope.id), formatError('Failed to set active scope')),
                Result.tapOkAsync(() => changeEmitter.fire('SELECT_ACTIVE_SCOPE'))
            )
        },
        createScope: async (name: string) => {
            if (localRepository.getByName(name)) {
                return Result.err(ERROR_DUPLICATE_SCOPE_NAME)
            }
            const newScope: Scope = { name, id: crypto.randomUUID(), files: [] }

            return pipe(
                Result.fromPromise(localRepository.add(newScope), formatError('Failed to create scope')),
                Result.tapOkAsync(() => changeEmitter.fire('CREATE_SCOPE'))
            )
        },
        addFileToScope: async (scopeId: string, filePath: string) => {
            const scope = localRepository.getById(scopeId)
            if (!scope) {
                return Result.err(ERROR_SCOPE_NOT_FOUND)
            }
            const fileAlreadyInScope = scope.files.includes(filePath)
            if (fileAlreadyInScope) {
                return Result.err(ERROR_FILE_ALREADY_EXISTS)
            }
            return pipe(
                Result.fromPromise(
                    localRepository.update(scope.id, (s) => ({ ...s, files: [...s.files, filePath] })),
                    formatError('Failed to add file to scope')
                ),
                Result.tapOkAsync(() => changeEmitter.fire('ADD_FILE_TO_SCOPE'))
            )
        },
        removeFileFromScope: async (scopeId: string, filePath: string) => {
            const scope = localRepository.getById(scopeId)
            if (!scope) {
                return Result.err(ERROR_SCOPE_NOT_FOUND)
            }

            return pipe(
                Result.fromPromise(
                    localRepository.update(scope.id, (s) => ({
                        ...s,
                        files: s.files.filter((f) => f !== filePath),
                    })),
                    formatError('Failed to remove file from scope')
                ),
                Result.tapOkAsync(() => changeEmitter.fire('REMOVE_FILE_FROM_SCOPE'))
            )
        },
        renameScope: async (scopeId: string, newName: string) => {
            const scope = localRepository.getById(scopeId)
            if (!scope) {
                return Result.err(ERROR_SCOPE_NOT_FOUND)
            }
            if (localRepository.getByName(newName)) {
                return Result.err(ERROR_DUPLICATE_SCOPE_NAME)
            }

            return pipe(
                Result.fromPromise(
                    localRepository.update(scope.id, (s) => ({ ...s, name: newName })),
                    formatError('Failed to rename scope')
                ),
                Result.tapOkAsync(() => changeEmitter.fire('RENAME_SCOPE'))
            )
        },
        swapFilesInScope: async (scopeId: string, filePath: string, targetFilePath: string | null) => {
            const scope = localRepository.getById(scopeId)
            if (!scope) {
                return Result.err(ERROR_SCOPE_NOT_FOUND)
            }

            let files: string[]

            if (targetFilePath === null) {
                files = [...scope.files.filter((f) => f !== filePath), filePath]
            } else {
                const fileIndex = scope.files.indexOf(filePath)
                const targetIndex = scope.files.indexOf(targetFilePath)
                if (fileIndex === -1 || targetIndex === -1) {
                    return Result.err(ERROR_SCOPE_NOT_FOUND)
                }
                files = [...scope.files]
                ;[files[fileIndex], files[targetIndex]] = [files[targetIndex], files[fileIndex]]
            }

            return pipe(
                Result.fromPromise(
                    localRepository.update(scope.id, (s) => ({ ...s, files })),
                    formatError('Failed to reorder files in scope')
                ),
                Result.tapOkAsync(() => changeEmitter.fire('MOVE_FILE_IN_SCOPE'))
            )
        },
        getScopeFiles: (scopeId: string): Result<readonly string[], string> => {
            const scope = localRepository.getById(scopeId)
            if (!scope) {
                return Result.err(ERROR_SCOPE_NOT_FOUND)
            }
            return Result.ok(scope.files)
        },
        deleteScope: async (scopeId: string) => {
            const scope = localRepository.getById(scopeId)
            if (!scope) {
                return Result.err(ERROR_SCOPE_NOT_FOUND)
            }
            return pipe(
                Result.fromPromise(localRepository.delete(scopeId), formatError('Failed to delete scope')),
                Result.tapOkAsync(() => changeEmitter.fire('DELETE_SCOPE'))
            )
        },
    }
}
