import { ExtensionContext } from "vscode";
import { createScopeRepository } from "./repositories/scopeRepository";
import { createScopeService } from "./services/scopeService";
import { createStatusBarService } from "./services/statusBarService";
import { registerCommands } from "./utils/register";
import { CommandContext } from "./types/commandContext";
import { createTreeViewService } from "./services/treeViewService";
import commandsList from "./commands";

export async function activate(context: ExtensionContext): Promise<void> {
	const repository = createScopeRepository(context);
	const scopeService = createScopeService(repository);
	const statusBarService = createStatusBarService(context, scopeService);
	const treeViewService = createTreeViewService(context, scopeService);

	const commandContext: CommandContext = {
		extensionContext: context,
		scopeService,
		statusBarService,
		treeViewService,
	};

	registerCommands(commandContext, commandsList);
}

export function deactivate(): void { }
