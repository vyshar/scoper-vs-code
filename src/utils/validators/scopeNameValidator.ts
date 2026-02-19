import vscode from 'vscode'
import { IScopeService } from '@/services/scope.service'
import { ERROR_DUPLICATE_SCOPE_NAME, ERROR_EMPTY_SCOPE_NAME } from '../errors'
import { Option } from '../data-types/Option'

export const createScopeNameValidator = (scopeService: IScopeService): vscode.InputBoxOptions['validateInput'] => {
    const scopeExists = (name: string) => Option.isSome(scopeService.getScopeByName(name))
    return (name: string) => {
        if (name.trim().length === 0) {
            return ERROR_EMPTY_SCOPE_NAME
        }
        if (scopeExists(name.trim())) {
            return ERROR_DUPLICATE_SCOPE_NAME
        }
        return null
    }
}
