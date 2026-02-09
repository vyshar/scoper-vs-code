import { ScopeRepository } from "../repositories/scopeRepository";
import { createId } from "../utils/id";
import { Err, fromNullable, fromNullableAsync, Ok, Result, tryCatchAsync } from "../utils";
import { Scope } from "../types/scope";
import { ERROR_DUPLICATE_NAME, ERROR_NO_ACTIVE_SCOPE, ERROR_SCOPE_NOT_FOUND, ERROR_FILE_ALREADY_EXISTS, ERROR_FILE_ADD_FAILED, ERROR_FILE_INDEX_OUT_OF_BOUNDS } from "../utils/errors";

export const createScopeService = (repository: ScopeRepository) => {
    const isNameTaken = (name: string, excludeId?: string): boolean =>
        repository.getScopes().some(scope => scope.name === name && scope.id !== excludeId);

    return {
        createScope: async (name: string): Promise<Result<Scope, string>> => {
            if (isNameTaken(name)) {
                return Err(ERROR_DUPLICATE_NAME);
            }

            return tryCatchAsync(() => repository.addScope({
                id: createId(),
                name,
                files: [],
            }));
        },

        getScopes: (): readonly Scope[] =>
            repository.getScopes(),

        getActiveScope: (): Result<Scope, string> =>
            fromNullable(repository.getActiveScope(), ERROR_NO_ACTIVE_SCOPE),

        setActiveScope: (scopeId: string): Promise<Result<Scope, string>> =>
            fromNullableAsync(repository.setActiveScope(scopeId), ERROR_SCOPE_NOT_FOUND),

        deleteScope: (scopeId: string): Promise<Result<Scope, string>> =>
            fromNullableAsync(repository.deleteScope(scopeId), ERROR_SCOPE_NOT_FOUND),

        addFileToScope: async (filePath: string): Promise<Result<Scope, string>> => {
            const activeScope = repository.getActiveScope();

            if (!activeScope) {
                return Err(ERROR_NO_ACTIVE_SCOPE);
            }

            if (activeScope.files.includes(filePath)) {
                return Err(ERROR_FILE_ALREADY_EXISTS);
            }

            return fromNullableAsync(
                repository.addFileToScope(activeScope.id, filePath),
                ERROR_FILE_ADD_FAILED,
            );
        },

        removeFileFromScope: (scopeId: string, filePath: string): Promise<Result<Scope, string>> =>
            fromNullableAsync(repository.removeFileFromScope(scopeId, filePath), ERROR_SCOPE_NOT_FOUND),

        renameScope: async (scopeId: string, newName: string): Promise<Result<Scope, string>> => {
            if (isNameTaken(newName, scopeId)) {
                return Err(ERROR_DUPLICATE_NAME);
            }

            return fromNullableAsync(
                repository.renameScope(scopeId, newName),
                ERROR_SCOPE_NOT_FOUND,
            );
        },

        getScopeFileByIndex: (index: number): Result<string, string> => {
            const activeScope = repository.getActiveScope();

            if (!activeScope) {
                return Err(ERROR_NO_ACTIVE_SCOPE);
            }

            const filePath = activeScope.files[index];

            return filePath !== undefined ? Ok(filePath) : Err(ERROR_FILE_INDEX_OUT_OF_BOUNDS);
        },

        getScopeFiles: (scopeId: string): readonly string[] =>
            repository.getScopeFiles(scopeId),

        isFileInActiveScope: (filePath: string): boolean =>
            repository.isFileInActiveScope(filePath),
    };
};

export type ScopeService = ReturnType<typeof createScopeService>;
