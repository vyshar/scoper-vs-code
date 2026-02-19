import vscode from 'vscode'
import { Scope } from './scope'

type TreeItemProps = Pick<
    vscode.TreeItem,
    'id' | 'label' | 'description' | 'iconPath' | 'collapsibleState' | 'command' | 'contextValue'
>

export type IScopeTreeItem = {
    contextValue: 'scope' | 'activeScope'
    scope: Scope
} & TreeItemProps

export type IScopeFileTreeItem = {
    contextValue: 'file'
    path: string
    scopeId: string
} & TreeItemProps
