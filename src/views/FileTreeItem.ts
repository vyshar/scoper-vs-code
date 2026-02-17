import vscode from 'vscode'
import { IScopeFileTreeItem } from '@/types/TreeItem'

export const FileTreeItem =
    (scopeId: string) =>
    (filePath: string): IScopeFileTreeItem => {
        const fileName = filePath.split('/').pop() || filePath
        const dir = vscode.workspace.asRelativePath(filePath).split('/').slice(0, -1).join('/')

        return {
            id: `${scopeId}/${filePath}`,
            contextValue: 'file',
            path: filePath,
            scopeId,
            label: fileName,
            description: dir,
            iconPath: new vscode.ThemeIcon('file'),
            collapsibleState: vscode.TreeItemCollapsibleState.None,
            command: {
                command: 'vscode.open',
                title: 'Open File',
                arguments: [vscode.Uri.file(filePath)],
            },
        }
    }
