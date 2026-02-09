import { window, workspace } from "vscode";
import { defineCommand } from "../utils/register";
import { match } from "../utils";

export const addFileToScopeCommand = defineCommand('addFileToScope', ({ scopeService, treeViewService }) => async () => {
    const file = window.activeTextEditor?.document.uri;

    if (!file) {
        window.showErrorMessage("No active file to add to scope.");
        return;
    }

    const relativePath = workspace.asRelativePath(file);

    const addFileResult = await scopeService.addFileToScope(relativePath);
    match(addFileResult, {
        ok: () => {
            treeViewService.refresh();
            window.showInformationMessage(`File "${relativePath}" added to scope successfully.`);
        },
        err: (error) => window.showErrorMessage(`Failed to add file to scope: ${error}`),
    });
});