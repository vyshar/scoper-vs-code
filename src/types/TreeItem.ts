import vscode from 'vscode'
import { Scope } from './Scope'

export type IScopeTreeItem = {
    contextValue: 'scope' | 'activeScope'
    scope: Scope
} & Partial<vscode.TreeItem>

export type IScopeFileTreeItem = Partial<vscode.TreeItem> & {
    path: string
    scopeId: string
    contextValue: 'file'
}
