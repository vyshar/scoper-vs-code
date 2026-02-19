import vscode from 'vscode'
import { IScopeService } from '@/services/scope.service'
import { IScopeFileTreeItem, IScopeTreeItem } from '@/types/TreeItem'
import { Result } from '@/utils/data-types/Result'
import { notify } from '@/utils/vscode/notify'

export const DragAndDropController = (
    scopeService: IScopeService
): vscode.TreeDragAndDropController<IScopeFileTreeItem | IScopeTreeItem> => {
    return {
        dragMimeTypes: ['application/vnd.code.tree.scoperTreeView'],
        dropMimeTypes: ['application/vnd.code.tree.scoperTreeView'],
        handleDrag(
            source: (IScopeFileTreeItem | IScopeTreeItem)[],
            dataTransfer: vscode.DataTransfer,
            _token: vscode.CancellationToken
        ) {
            dataTransfer.set('application/vnd.code.tree.scoperTreeView', new vscode.DataTransferItem(source[0]))
        },
        handleDrop(
            target: IScopeFileTreeItem | IScopeTreeItem,
            dataTransfer: vscode.DataTransfer,
            _token: vscode.CancellationToken
        ) {
            const transferItem = dataTransfer.get('application/vnd.code.tree.scoperTreeView')
            if (!transferItem) return

            const source: IScopeFileTreeItem | IScopeTreeItem = transferItem.value satisfies
                | IScopeFileTreeItem
                | IScopeTreeItem

            if (source.contextValue !== 'file') return

            const targetScopeId = target.contextValue === 'file' ? target.scopeId : target.scope.id

            if (source.scopeId === targetScopeId) {
                if (source.path === (target.contextValue === 'file' ? target.path : null)) return

                const targetFilePath = target.contextValue === 'file' ? target.path : null
                scopeService.swapFilesInScope(source.scopeId, source.path, targetFilePath).then((result) => {
                    if (Result.isErr(result)) notify.error(result.error)
                    return
                })
            }

            // const removeResult = await scopeService.removeFileFromScope(source.scopeId, source.path)
            // if (Result.isErr(removeResult)) {
            //     notify.error(removeResult.error)
            //     return
            // }

            // const addResult = await scopeService.addFileToScope(targetScopeId, source.path)
            // if (Result.isErr(addResult)) {
            //     notify.error(addResult.error)
            // }
        },
    }
}
