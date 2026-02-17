import { defineCommand } from '@/utils/command'
import { Result } from '@/utils/data-types/Result'
import { notify } from '@/utils/vscode/notify'
import type { IScopeFileTreeItem } from '@/types/TreeItem'

export const removeFileFromScopeCommand = defineCommand(
    'removeFileFromScope',
    ({ scopeService, treeViewService }) =>
        async (scopeFileTreeItem?: IScopeFileTreeItem) => {
            if (!scopeFileTreeItem) {
                return
            }

            const { scopeId, path } = scopeFileTreeItem

            const removeFileResult = await scopeService.removeFileFromScope(scopeId, path)

            if (Result.isErr(removeFileResult)) {
                return notify.error(removeFileResult.error)
            }

            treeViewService.refresh()

            const filename = path.split('/').pop()

            return notify.success(`File "${filename}" removed from scope`)
        }
)
