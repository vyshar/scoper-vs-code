import { EventEmitter, ExtensionContext, window, workspace } from 'vscode'
import type { IScopeService } from './scope.service'
import { ScopeFileTreeItem, ScopeTreeItem } from '../types/TreeItem'
import { createTreeDataProvider } from './treeDataProvider'

export const TreeViewService = (context: ExtensionContext, scopeService: IScopeService) => {
    const treeViewEventEmitter = new EventEmitter<ScopeTreeItem | ScopeFileTreeItem | undefined>()
    const treeDataProvider = createTreeDataProvider(scopeService, treeViewEventEmitter)

    const treeView = window.createTreeView('scoperTreeView', {
        treeDataProvider,
        showCollapseAll: false,
    })

    const buildRevealId = (relativePath: string): string => {
        // const activeScope = scopeService.getActiveScope()
        // if (!activeScope.ok) {
        //     return ''
        // }
        // return scopeService.isFileInActiveScope(relativePath)
        //     ? `${activeScope.value.id}/${relativePath}`
        //     : activeScope.value.id
        return ''
    }

    window.onDidChangeActiveTextEditor((editor) => {
        if (!editor || !treeView.visible) {
            return
        }

        // const activeScope = scopeService.getActiveScope()
        // if (!activeScope.ok) {
        //     return
        // }

        const openedFileUri = editor.document.uri
        const relativePath = workspace.asRelativePath(openedFileUri)
        const revealId = buildRevealId(relativePath)

        if (!revealId) {
            return
        }

        // VS Code reveal() matches by id, but requires the full item type — unavoidable assertion
        treeView.reveal({ id: revealId } as ScopeTreeItem | ScopeFileTreeItem, {
            focus: false,
            select: true,
            expand: true,
        })
    })

    context.subscriptions.push(treeView)
    context.subscriptions.push(treeViewEventEmitter)

    return {
        refresh: () => {
            treeViewEventEmitter.fire(undefined)
        },
    }
}

export type ITreeViewService = ReturnType<typeof TreeViewService>
