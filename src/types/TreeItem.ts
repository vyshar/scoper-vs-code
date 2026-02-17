import { TreeItem } from 'vscode'
import { Scope } from './Scope'

export type ScopeTreeItem = TreeItem & {
    contextValue: 'scope' | 'activeScope'
    scope: Scope
}

export type ScopeFileTreeItem = TreeItem & {
    path: string
    scopeId: string
    contextValue: 'file'
}
