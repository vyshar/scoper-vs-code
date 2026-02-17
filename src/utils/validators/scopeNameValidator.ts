import vscode from 'vscode'
import { IScopeService } from '@/services/scope.service'
import { ERROR_DUPLICATE_SCOPE_NAME, ERROR_EMPTY_SCOPE_NAME } from '../errors'
import { Option } from '../data-types/Option'

export function createScopeNameValidator(scopeService: IScopeService): vscode.InputBoxOptions['validateInput'] {
    const scopeExists = (name: string) => Option.isSome(scopeService.getScopeByName(name))
    return (name: string) => {
        const trimmedName = name.trim()
        if (trimmedName.length === 0) {
            return ERROR_EMPTY_SCOPE_NAME
        }
        if (scopeExists(trimmedName)) {
            return ERROR_DUPLICATE_SCOPE_NAME
        }
        return null
    }
}
