import { EventEmitter, ProviderResult, ThemeIcon, TreeDataProvider, TreeItem, TreeItemCollapsibleState, Uri, workspace } from "vscode";
import { ScopeService } from "./scopeService";
import { ScopeFileTreeItem, ScopeTreeItem } from "../types/TreeItem";

const resolveWorkspaceUri = (relativePath: string): Uri | undefined => {
    const workspaceFolder = workspace.workspaceFolders?.[0];
    return workspaceFolder ? Uri.joinPath(workspaceFolder.uri, relativePath) : undefined;
};

export const createTreeDataProvider = (scopeService: ScopeService, treeViewEventEmitter: EventEmitter<ScopeTreeItem | ScopeFileTreeItem | undefined>): TreeDataProvider<ScopeTreeItem | ScopeFileTreeItem> => ({
    getTreeItem: (element: ScopeTreeItem | ScopeFileTreeItem): TreeItem => element,

    getParent: (element: ScopeTreeItem | ScopeFileTreeItem) => {
        if (element?.contextValue !== "file") { return undefined; }

        const scopes = scopeService.getScopes();
        const parentScope = scopes.find(s => s.id === element.scopeId);

        if (!parentScope) { return undefined; }

        const scopeTreeItem: ScopeTreeItem = {
            id: parentScope.id,
            contextValue: "scope",
            scope: parentScope,
            label: parentScope.name,
            collapsibleState: TreeItemCollapsibleState.Expanded,
            iconPath: new ThemeIcon('folder-open'),
        };
        return scopeTreeItem;
    },

    getChildren: (element?: ScopeTreeItem | ScopeFileTreeItem): ProviderResult<(ScopeTreeItem | ScopeFileTreeItem)[]> => {
        if (!element) {
            const scopes = scopeService.getScopes();
            const activeScope = scopeService.getActiveScope();
            const activeScopeId = activeScope.ok ? activeScope.value.id : undefined;

            return scopes.map(scope => ({
                id: scope.id,
                contextValue: activeScopeId === scope.id ? "activeScope" as const : "scope" as const,
                scope,
                label: scope.name + (activeScopeId === scope.id ? " (Active)" : ""),
                collapsibleState: TreeItemCollapsibleState.Collapsed,
                iconPath: new ThemeIcon('folder'),
            }));
        }

        if (element.contextValue === "scope" || element.contextValue === "activeScope") {
            const files = scopeService.getScopeFiles(element.scope.id);

            return files.map((filePath) => {
                const fileName = filePath.split("/").pop() || filePath;
                const dir = filePath.split("/").slice(0, -1).join("/");
                const fileUri = resolveWorkspaceUri(filePath);

                return {
                    id: `${element.scope.id}/${filePath}`,
                    contextValue: "file" as const,
                    path: filePath,
                    label: fileName,
                    scopeId: element.scope.id,
                    iconPath: new ThemeIcon('file'),
                    collapsibleState: TreeItemCollapsibleState.None,
                    description: dir,
                    ...(fileUri ? {
                        command: {
                            command: 'vscode.open',
                            title: 'Open File',
                            arguments: [fileUri],
                        },
                    } : {}),
                };
            });
        }

        return undefined;
    },

    onDidChangeTreeData: treeViewEventEmitter.event,
});
