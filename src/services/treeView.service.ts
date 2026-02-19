import vscode from 'vscode'
import type { IScopeService } from './scope.service'
import { IScopeFileTreeItem, IScopeTreeItem } from '../types/TreeItem'
import { ScopeTreeDataProvider } from '../views/treeDataProvider'
import { Option } from '@/utils/data-types/Option'
import { pipe } from '@/utils/pipe'
import { ChangeEventEmitter } from '@/types/ChangeEventEmitter'
import { DragAndDropController } from '@/controllers/dragAndDropController'

export const TreeViewService = (scopeService: IScopeService, changeEmitter: ChangeEventEmitter) => {
    const treeDataProvider = ScopeTreeDataProvider(scopeService, changeEmitter)
    const treeView = vscode.window.createTreeView('scoperTreeView', {
        treeDataProvider,
        dragAndDropController: DragAndDropController(scopeService),
        showCollapseAll: false,
    })

    const buildRevealId = (openedDocumentPath: string): Option<string> =>
        pipe(
            scopeService.getActiveScope(),
            Option.map((scope) => {
                return scope.files.includes(openedDocumentPath) ? `${scope.id}/${openedDocumentPath}` : scope.id
            })
        )

    const editorChangeDisposable = vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (!editor || !treeView.visible) {
            return
        }

        pipe(
            buildRevealId(editor.document.uri.fsPath ?? ''),
            Option.whenSome((revealId) => {
                return treeView.reveal({ id: revealId } as IScopeTreeItem | IScopeFileTreeItem, {
                    focus: false,
                    select: true,
                    expand: true,
                })
            })
        )
    })

    return {
        disposables: () => [treeView, editorChangeDisposable],
    }
}

export type ITreeViewService = ReturnType<typeof TreeViewService>
