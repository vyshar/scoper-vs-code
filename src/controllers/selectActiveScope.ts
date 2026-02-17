import vscode from 'vscode'
import { defineCommand } from '@/utils/command'
import { Option } from '@/utils/data-types/Option'
import { Result } from '@/utils/data-types/Result'
import { notify } from '@/utils/vscode/notify'
import { IScopeTreeItem } from '@/types/TreeItem'
import { showPicker } from '@/utils/vscode/showPicker'

export const selectActiveScopeCommand = defineCommand(
    'selectActiveScope',
    ({ scopeService, treeViewService, statusBarService }) =>
        async (scopeTreeItem?: IScopeTreeItem) => {
            if (scopeTreeItem) {
                const activateResult = await scopeService.setActiveScope(scopeTreeItem.scope)
                if (Result.isErr(activateResult)) {
                    return notify.error(activateResult.error)
                }
                treeViewService.refresh()
                statusBarService.setActiveScopeName(scopeTreeItem.scope.name)
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

            treeViewService.refresh()
            statusBarService.setActiveScopeName(selectedScope.value.name)

            return notify.success(`Scope "${selectedScope.value.name}" is now active`)
        }
)
