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

    /**
     * Active scope operations
     */
    getActiveScope(): Option<Scope>
    setActiveScope(scope: Scope): Promise<Result<void, string>>
    addFileToScope(scopeId: string, filePath: string): Promise<Result<Scope, string>>
    removeFileFromScope(scopeId: string, filePath: string): Promise<Result<Scope, string>>
    getScopeFiles(scopeId: string): Result<string[], string>
}

export const ScopeService = (localRepository: ILocalRepository): IScopeService => {
    return {
        getScopeByName: (name: string) => Option.fromNullable(localRepository.getByName(name)),
        getScopes: localRepository.getAll,
        getScopeById: (id: string): Option<Scope> => Option.fromNullable(localRepository.getById(id)),
        getActiveScope: (): Option<Scope> => Option.fromNullable(localRepository.getActiveScope()),
        setActiveScope: async (scope: Scope) => {
            return Result.fromPromise(
                localRepository.setActiveScope(scope.id),
                formatError('Failed to set active scope')
            )
        },
        createScope: async (name: string) => {
            if (localRepository.getByName(name)) {
                return Result.err(ERROR_DUPLICATE_SCOPE_NAME)
            }
            const newScope: Scope = { name, id: crypto.randomUUID(), files: [] }

            return Result.fromPromise(localRepository.add(newScope), formatError('Failed to create scope'))
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
            return Result.fromPromise(
                localRepository.update(scope.id, (s) => ({ ...s, files: [...s.files, filePath] })),
                formatError('Failed to add file to scope')
            )
        },
        removeFileFromScope: async (scopeId: string, filePath: string) => {
            const scope = localRepository.getById(scopeId)
            if (!scope) {
                return Result.err(ERROR_SCOPE_NOT_FOUND)
            }

            return Result.fromPromise(
                localRepository.update(scope.id, (s) => ({ ...s, files: s.files.filter((f) => f !== filePath) })),
                formatError('Failed to remove file from scope')
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

            return Result.fromPromise(
                localRepository.update(scope.id, (s) => ({ ...s, name: newName })),
                formatError('Failed to rename scope')
            )
        },
        getScopeFiles: (scopeId: string): Result<string[], string> => {
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
            return Result.fromPromise(localRepository.delete(scopeId), formatError('Failed to delete scope'))
        },
    }
}
