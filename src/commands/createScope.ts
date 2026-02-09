import { window } from "vscode";
import { defineCommand } from "../utils/register";
import { match } from "../utils";
import { validateScopeName } from "../utils/validation";

export const createScopeCommand = defineCommand(
    "createScope",
    ({ scopeService, treeViewService, statusBarService }) => async () => {
        const name = await window.showInputBox({
            prompt: "Enter scope name",
            validateInput: validateScopeName,
        });

        if (!name) { return; }

        const createScopeResult = await scopeService.createScope(name.trim());

        match(createScopeResult, {
            ok: () => {
                treeViewService.refresh();
                const active = scopeService.getActiveScope();
                if (active.ok) { statusBarService.updateActiveScope(active.value.name); }
            },
            err: (error) => window.showErrorMessage(`Failed to create scope: ${error}`),
        });
    }
);
