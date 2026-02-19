import { basename } from 'node:path'
import vscode from 'vscode'
import { IScopeFileTreeItem } from '@/types/TreeItem'

export const FileTreeItem =
    (scopeId: string) =>
    (filePath: string, relativeDir: string): IScopeFileTreeItem => ({
        id: `${scopeId}/${filePath}`,
        contextValue: 'file',
        path: filePath,
        scopeId,
        label: basename(filePath),
        description: relativeDir,
        iconPath: new vscode.ThemeIcon('file'),
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        command: {
            command: 'vscode.open',
            title: 'Open File',
            arguments: [vscode.Uri.file(filePath)],
        },
    })
