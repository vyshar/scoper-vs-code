import vscode from 'vscode'
import type { IScopeService } from './scope.service'
import { IScopeFileTreeItem, IScopeTreeItem } from '../types/TreeItem'
import { ScopeTreeDataProvider } from '../views/treeDataProvider'
import { Option } from '@/utils/data-types/Option'
import { pipe } from '@/utils/pipe'

export const TreeViewService = (scopeService: IScopeService) => {
    const treeViewEventEmitter = new vscode.EventEmitter<IScopeTreeItem | IScopeFileTreeItem | undefined>()
    const treeDataProvider = ScopeTreeDataProvider(scopeService, treeViewEventEmitter)

    const treeView = vscode.window.createTreeView('scoperTreeView', {
        treeDataProvider,
        showCollapseAll: false,
    })

    const buildRevealId = (openedDocumentPath: string): Option<string> =>
        pipe(
            scopeService.getActiveScope(),
            Option.map((scope) => {
                return scope.files.includes(openedDocumentPath) ? `${scope.id}/${openedDocumentPath}` : scope.id
            })
        )

    vscode.window.onDidChangeActiveTextEditor((editor) => {
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
        refresh: () => {
            treeViewEventEmitter.fire(undefined)
        },
        disposables: () => [treeView, treeViewEventEmitter],
    }
}

export type ITreeViewService = ReturnType<typeof TreeViewService>
