import { defineCommand } from '@/utils/command'
import { showInput } from '@/utils/vscode/showInput'
import { IScopeTreeItem } from '@/types/TreeItem'
import { createScopeNameValidator } from '@/utils/validators/scopeNameValidator'
import { Option } from '@/utils/data-types/Option'
import { Result } from '@/utils/data-types/Result'
import { notify } from '@/utils/vscode/notify'

export const renameScopeCommand = defineCommand(
    'renameScope',
    ({ scopeService, treeViewService }) =>
        async (scopeTreeItem?: IScopeTreeItem) => {
            if (!scopeTreeItem) {
                return
            }

            const newName = await showInput('Enter new scope name', {
                value: scopeTreeItem.scope.name,
                validateInput: createScopeNameValidator(scopeService),
            })

            if (Option.isNone(newName)) {
                return
            }
            const renameResult = await scopeService.renameScope(scopeTreeItem.scope.id, newName.value)
            if (Result.isErr(renameResult)) {
                return notify.error('Failed to rename scope')
            }

            treeViewService.refresh()
            return notify.success(`Scope renamed to "${newName.value}"`)
        }
)
