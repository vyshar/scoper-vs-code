import { IScopeTreeItem } from '@/types/TreeItem'
import { defineCommand } from '@/utils/command'
import { Result } from '@/utils/data-types/Result'
import { notify } from '@/utils/vscode/notify'

export const deleteScopeCommand = defineCommand(
    'deleteScope',
    ({ scopeService }) =>
        async (scopeTreeItem?: IScopeTreeItem) => {
            if (!scopeTreeItem) {
                return
            }

            const deleteResult = await scopeService.deleteScope(scopeTreeItem.scope.id)

            if (Result.isErr(deleteResult)) {
                return notify.error(deleteResult.error)
            }

            return notify.success(`Scope "${scopeTreeItem.scope.name}" deleted`)
        }
)
