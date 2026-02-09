import { ExtensionContext } from "vscode";
import { Scope } from "../types/scope";

const SCOPES_KEY = "scopes";
const ACTIVE_SCOPE_KEY = "activeScopeId";

export const createScopeRepository = (ctx: ExtensionContext) => {
    const state = ctx.workspaceState;

    const getScopes = (): readonly Scope[] =>
        state.get<Scope[]>(SCOPES_KEY, []);

    const getActiveScopeId = (): string | undefined =>
        state.get<string | undefined>(ACTIVE_SCOPE_KEY, undefined);

    const getScopeById = (id: string): Scope | undefined =>
        getScopes().find(scope => scope.id === id);

    const getActiveScope = (): Scope | undefined => {
        const activeScopeId = getActiveScopeId();
        return activeScopeId ? getScopeById(activeScopeId) : undefined;
    };

    const updateScope = async (scopeId: string, updater: (scope: Scope) => Scope): Promise<Scope | undefined> => {
        const scope = getScopeById(scopeId);

        if (!scope) { return undefined; }

        const updated = updater(scope);

        await state.update(SCOPES_KEY, getScopes().map(s =>
            s.id === scopeId ? updated : s
        ));

        return updated;
    };

    return {
        getScopes,
        getScopeById,
        getActiveScope,

        addScope: async (scope: Scope): Promise<Scope> => {
            const scopes = getScopes();

            if (scopes.length === 0) {
                await state.update(ACTIVE_SCOPE_KEY, scope.id);
            }

            await state.update(SCOPES_KEY, [...scopes, scope]);
            return scope;
        },

        setActiveScope: async (scopeId: string): Promise<Scope | undefined> => {
            const scope = getScopeById(scopeId);

            if (!scope) { return undefined; }

            await state.update(ACTIVE_SCOPE_KEY, scopeId);
            return scope;
        },

        deleteScope: async (scopeId: string): Promise<Scope | undefined> => {
            const scope = getScopeById(scopeId);

            if (!scope) { return undefined; }

            const filtered = getScopes().filter(s => s.id !== scopeId);
            await state.update(SCOPES_KEY, filtered);

            if (getActiveScopeId() === scopeId) {
                await state.update(ACTIVE_SCOPE_KEY, filtered[0]?.id);
            }

            return scope;
        },

        getScopeFiles: (scopeId: string): readonly string[] =>
            getScopeById(scopeId)?.files ?? [],

        addFileToScope: (scopeId: string, filePath: string): Promise<Scope | undefined> =>
            updateScope(scopeId, scope => ({
                ...scope,
                files: [...scope.files, filePath],
            })),

        removeFileFromScope: (scopeId: string, filePath: string): Promise<Scope | undefined> =>
            updateScope(scopeId, scope => ({
                ...scope,
                files: scope.files.filter(file => file !== filePath),
            })),

        renameScope: (scopeId: string, newName: string): Promise<Scope | undefined> =>
            updateScope(scopeId, scope => ({
                ...scope,
                name: newName,
            })),

        isFileInActiveScope: (filePath: string): boolean => {
            const activeScope = getActiveScope();
            return activeScope ? activeScope.files.includes(filePath) : false;
        },
    };
};

export type ScopeRepository = ReturnType<typeof createScopeRepository>;
