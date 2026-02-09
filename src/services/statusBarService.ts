import { ExtensionContext } from "vscode";
import { createStatusBarItem } from "../views/statusBarItem";
import { ScopeService } from "./scopeService";

const DEFAULT_SCOPE_NAME = 'None';

export const createStatusBarService = (context: ExtensionContext, scopeService: ScopeService) => {
    const activeScope = scopeService.getActiveScope();

    const statusBarItem = createStatusBarItem(activeScope.ok ? activeScope.value.name : DEFAULT_SCOPE_NAME);

    statusBarItem.show();

    context.subscriptions.push(statusBarItem);

    return {
        updateActiveScope: (scopeName?: string) => {
            statusBarItem.text = `$(layers) ${scopeName ?? DEFAULT_SCOPE_NAME}`;
            statusBarItem.show();
        },
    };
};

export type StatusBarService = ReturnType<typeof createStatusBarService>;
