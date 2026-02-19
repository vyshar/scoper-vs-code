import vscode from 'vscode'
import { Scope } from '@/types/Scope'

import { ACTIVE_SCOPE_KEY, SCOPES_KEY } from './keys'

export interface ILocalRepository {
    getAll: () => Scope[]
    getById: (id: string) => Scope | undefined
    getByName: (name: string) => Scope | undefined
    add: (scope: Scope) => Promise<Scope>
    update: (scopeId: string, updater: (scope: Scope) => Scope) => Promise<Scope>
    delete: (scopeId: string) => Promise<void>
    setActiveScope: (scopeId: string) => Promise<void>
    clearActiveScope: () => Promise<void>
    getActiveScope: () => Scope | undefined
}
export const LocalRepository = (state: vscode.Memento): ILocalRepository => {
    const getScopes = (): Scope[] => state.get<Scope[]>(SCOPES_KEY, [])
    const getScopeById = (id: string): Scope | undefined => getScopes().find((scope) => scope.id === id)
    return {
        getActiveScope: (): Scope | undefined => {
            const activeScopeId = state.get<string>(ACTIVE_SCOPE_KEY)
            return activeScopeId ? getScopeById(activeScopeId) : undefined
        },
        setActiveScope: async (scopeId: string): Promise<void> => {
            await state.update(ACTIVE_SCOPE_KEY, scopeId)
        },
        clearActiveScope: async (): Promise<void> => {
            await state.update(ACTIVE_SCOPE_KEY, undefined)
        },
        getAll: getScopes,
        getById: getScopeById,
        getByName: (name: string): Scope | undefined => getScopes().find((scope) => scope.name === name),
        add: async (scope: Scope): Promise<Scope> => {
            const scopes = getScopes()
            await state.update(SCOPES_KEY, [...scopes, scope])
            return scope
        },
        update: async (scopeId: string, updater: (scope: Scope) => Scope): Promise<Scope> => {
            const scopes = getScopes()
            const updatedScopes = scopes.map((s) => (s.id === scopeId ? updater(s) : s))
            await state.update(SCOPES_KEY, updatedScopes)
            const updated = updatedScopes.find((s) => s.id === scopeId)
            if (!updated) throw new Error(`Scope ${scopeId} not found after update`)
            return updated
        },
        delete: async (scopeId: string): Promise<void> => {
            await state.update(
                SCOPES_KEY,
                getScopes().filter((s) => s.id !== scopeId)
            )
        },
    }
}
