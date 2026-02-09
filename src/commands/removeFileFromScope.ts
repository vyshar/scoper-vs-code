import { match } from "../utils";
import { ScopeFileTreeItem } from "../types/TreeItem";
import { defineCommand } from "../utils/register";
import { window } from "vscode";

export const removeFileFromScopeCommand = defineCommand('removeFileFromScope', ({ scopeService, treeViewService }) => async (fileTreeItem?: ScopeFileTreeItem) => {
    if (!fileTreeItem) {
        return;
    }

    const removeFileResult = await scopeService.removeFileFromScope(fileTreeItem.scopeId, fileTreeItem.path);

    match(removeFileResult, {
        ok: () => {
            treeViewService.refresh();
        },
        err: (error) => window.showErrorMessage(error),
    });
});