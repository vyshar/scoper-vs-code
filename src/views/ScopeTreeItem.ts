import vscode from 'vscode'
import { Scope } from '@/types/Scope'
import { IScopeTreeItem } from '@/types/TreeItem'
import { Option } from '@/utils/data-types/Option'
import { pipe } from '@/utils/pipe'

export const ScopeTreeItem =
    (activeScopeId: Option<string>) =>
    (scope: Scope): IScopeTreeItem => {
        const isActive = pipe(
            activeScopeId,
            Option.match(
                (id) => id === scope.id,
                () => false
            )
        )
        return {
            id: scope.id,
            contextValue: isActive ? 'activeScope' : 'scope',
            scope,
            label: scope.name + (isActive ? ' (Active)' : ''),
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
            iconPath: new vscode.ThemeIcon('folder'),
        }
    }
