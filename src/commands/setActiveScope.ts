import { window } from "vscode";
import { defineCommand } from "../utils/register";
import { ScopeTreeItem } from "../types/TreeItem";
import { match } from "../utils";

export const setActiveScopeCommand = defineCommand(
    "setActiveScope",
    ({ scopeService, statusBarService, treeViewService }) => {
        const handleSetActive = async (scopeId: string) => {
            const setActiveResult = await scopeService.setActiveScope(scopeId);
            match(setActiveResult, {
                ok: (scope) => {
                    statusBarService.updateActiveScope(scope.name);
                    treeViewService.refresh();
                },
                err: (error) => window.showErrorMessage(`Failed to set active scope: ${error}`),
            });
        };

        return async (scopeTreeItem?: ScopeTreeItem) => {
            if (scopeTreeItem) {
                return handleSetActive(scopeTreeItem.scope.id);
            }

            const scopes = scopeService.getScopes();

            const items = scopes.map(scope => ({
                label: scope.name,
                description: scope.id,
                scopeId: scope.id,
            }));

            const selected = await window.showQuickPick(items, {
                placeHolder: "Select a scope to work with",
            });

            if (selected) {
                await handleSetActive(selected.scopeId);
            }
        };
    }
);
