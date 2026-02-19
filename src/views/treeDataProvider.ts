import vscode, { Event } from 'vscode'
import { IScopeService } from '../services/scope.service'
import { IScopeFileTreeItem, IScopeTreeItem } from '../types/TreeItem'
import { pipe } from '@/utils/pipe'
import { Option } from '@/utils/data-types/Option'
import { ScopeTreeItem } from './ScopeTreeItem'
import { FileTreeItem } from './FileTreeItem'
import { Result } from '@/utils/data-types/Result'
import { ChangeEventEmitter } from '@/types/ChangeEventEmitter'

export const ScopeTreeDataProvider = (
    scopeService: IScopeService,
    changeEventEmitter: ChangeEventEmitter
): vscode.TreeDataProvider<IScopeTreeItem | IScopeFileTreeItem> => {
    const treeDataChangeEventEmitter = new vscode.EventEmitter<IScopeTreeItem | IScopeFileTreeItem | undefined>()

    changeEventEmitter.event(() => {
        treeDataChangeEventEmitter.fire(undefined)
    })

    return {
        getTreeItem: (element: IScopeTreeItem | IScopeFileTreeItem): vscode.TreeItem => element,

        getParent: (element: IScopeTreeItem | IScopeFileTreeItem) => {
            return element.contextValue === 'file'
                ? pipe(
                      scopeService.getScopeById(element.scopeId),
                      Option.match(
                          ScopeTreeItem(
                              pipe(
                                  scopeService.getActiveScope(),
                                  Option.map((s) => s.id)
                              )
                          ),
                          () => undefined
                      )
                  )
                : undefined
        },

        getChildren: (
            element?: IScopeTreeItem | IScopeFileTreeItem
        ): vscode.ProviderResult<(IScopeTreeItem | IScopeFileTreeItem)[]> => {
            if (!element) {
                const activeScopeId = pipe(
                    scopeService.getActiveScope(),
                    Option.map((s) => s.id)
                )
                return scopeService.getScopes().map(ScopeTreeItem(activeScopeId))
            }

            if (element.contextValue === 'scope' || element.contextValue === 'activeScope') {
                return pipe(
                    scopeService.getScopeFiles(element.scope.id),
                    Result.match(
                        (files) => files.map<IScopeFileTreeItem>(FileTreeItem(element.scope.id)),
                        () => []
                    )
                )
            }

            return undefined
        },

        onDidChangeTreeData: treeDataChangeEventEmitter.event,
    }
}
