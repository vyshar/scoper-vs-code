import vscode from 'vscode'
import { defineCommand } from '@/utils/command'
import { Option } from '@/utils/data-types/Option'
import { Result } from '@/utils/data-types/Result'
import { notify } from '@/utils/vscode/notify'
import { ScopeTreeItem } from '@/types/TreeItem'
import { showPicker } from '@/utils/vscode/showPicker'

export const selectActiveScopeCommand = defineCommand(
    'selectActiveScope',
    ({ scopeService }) =>
        async (scopeTreeItem?: ScopeTreeItem) => {
            if (scopeTreeItem) {
                const activateResult = await scopeService.setActiveScope(scopeTreeItem.scope)
                if (Result.isErr(activateResult)) {
                    return notify.error(activateResult.error)
                }
                return
            }
            const scopes = scopeService.getScopes()

            if (scopes.length === 0) {
                return vscode.commands.executeCommand('scoper.createScope')
            }

            const selectedScope = await showPicker(scopes, (scope) => scope.name, 'Select a scope to activate')

            if (Option.isNone(selectedScope)) {
                return
            }

            const activateResult = await scopeService.setActiveScope(selectedScope.value)

            if (Result.isErr(activateResult)) {
                return notify.error(activateResult.error)
            }

            return notify.success(`Scope "${selectedScope.value.name}" is now active`)
        }
)
