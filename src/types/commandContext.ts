import { ExtensionContext } from "vscode";
import { ScopeService } from "../services/scopeService";
import { StatusBarService } from "../services/statusBarService";
import { TreeViewService } from "../services/treeViewService";

export interface CommandContext {
    readonly extensionContext: ExtensionContext;
    readonly scopeService: ScopeService;
    readonly statusBarService: StatusBarService;
    readonly treeViewService: TreeViewService;
}

export type CommandHandler<T extends unknown[] = []> = (...args: T) => Promise<void> | void;

export interface CommandDefinition<T extends unknown[] = []> {
    readonly id: string;
    readonly handler: (ctx: CommandContext) => CommandHandler<T>;
}
