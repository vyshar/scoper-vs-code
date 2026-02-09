import { window } from "vscode";
import { defineCommand } from "../utils/register";
import { match } from "../utils";
import { ScopeTreeItem } from "../types/TreeItem";
import { validateScopeName } from "../utils/validation";

export const renameScopeCommand = defineCommand('renameScope', ({ scopeService, treeViewService, statusBarService }) => async (scopeTreeItem?: ScopeTreeItem) => {
    if (!scopeTreeItem?.scope) { return; }

    const scopeId = scopeTreeItem.scope.id;

    const newName = await window.showInputBox({
        prompt: "Enter new scope name",
        value: scopeTreeItem.scope.name,
        valueSelection: [0, scopeTreeItem.scope.name.length],
        validateInput: validateScopeName,
    });

    if (!newName) { return; }

    if (newName.trim() === scopeTreeItem.scope.name) { return; }

    const renameResult = await scopeService.renameScope(scopeId, newName.trim());

    const activeScope = scopeService.getActiveScope();
    const shouldUpdateStatusBar = activeScope.ok && activeScope.value.id === scopeId;

    match(renameResult, {
        ok: (updatedScope) => {
            treeViewService.refresh();
            if (shouldUpdateStatusBar) {
                statusBarService.updateActiveScope(updatedScope.name);
            }
        },
        err: (error) => window.showErrorMessage(`Failed to rename scope: ${error}`),
    });
});
