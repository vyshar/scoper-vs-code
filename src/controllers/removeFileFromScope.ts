import vscode from 'vscode'
import { defineCommand } from '@/utils/command'
import { Option } from '@/utils/data-types/Option'
import { Result } from '@/utils/data-types/Result'
import { notify } from '@/utils/vscode/notify'
import { ScopeFileTreeItem } from '@/types/TreeItem'

export const removeFileFromScopeCommand = defineCommand(
    'removeFileFromScope',
    ({ scopeService }) =>
        async (scopeFileTreeItem?: ScopeFileTreeItem) => {
            if (!scopeFileTreeItem) {
                return
            }

            const { scopeId, path } = scopeFileTreeItem

            const removeFileResult = await scopeService.removeFileFromScope(scopeId, path)

            if (Result.isErr(removeFileResult)) {
                return notify.error(removeFileResult.error)
            }

            const filename = path.split('/').pop()
            const scope = scopeService.getScopeById(scopeId)

            if (Option.isNone(scope)) {
                return notify.error('Scope not found')
            }

            return notify.success(`File "${filename}" removed from scope "${scope.value.name}"`)
        }
)
