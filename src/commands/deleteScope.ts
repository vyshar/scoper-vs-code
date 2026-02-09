import { window } from "vscode";
import { defineCommand } from "../utils/register";
import { match } from "../utils";
import { ScopeTreeItem } from "../types/TreeItem";

export const deleteScopeCommand = defineCommand(
    "deleteScope",
    ({ scopeService, treeViewService, statusBarService }) => async (scopeTreeItem?: ScopeTreeItem) => {
        if (!scopeTreeItem) { return; }

        const confirm = await window.showWarningMessage(
            `Are you sure you want to delete scope "${scopeTreeItem.scope.name}"? This action cannot be undone.`,
            { modal: true },
            "Delete"
        );

        if (confirm !== "Delete") { return; }

        const deleteScopeResult = await scopeService.deleteScope(scopeTreeItem.scope.id);

        match(deleteScopeResult, {
            ok: () => {
                treeViewService.refresh();
                const newActive = scopeService.getActiveScope();
                statusBarService.updateActiveScope(newActive.ok ? newActive.value.name : undefined);
            },
            err: (error) => window.showErrorMessage(`Failed to delete scope: ${error}`),
        });
    });