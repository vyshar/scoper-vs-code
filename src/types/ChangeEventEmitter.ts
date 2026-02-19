import vscode from 'vscode'
import { IScopeFileTreeItem, IScopeTreeItem } from './TreeItem'

export type ChangeEventEmitter = vscode.EventEmitter<
    IScopeTreeItem | IScopeFileTreeItem | undefined | void | (IScopeTreeItem | IScopeFileTreeItem)[] | null | string
>
