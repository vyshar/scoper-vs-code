import { commands } from "vscode";
import { CommandDefinition, CommandContext, CommandHandler } from "../types/commandContext";

const COMMAND_PREFIX = "scoper.";

export const defineCommand = <T extends unknown[] = []>(
    id: string,
    handler: (ctx: CommandContext) => CommandHandler<T>
): CommandDefinition<T> => ({
    id,
    handler,
});

export const registerCommands = (
    commandContext: CommandContext,
    cmds: Array<CommandDefinition>
): void => {
    cmds.forEach(cmd => {
        const boundHandler = cmd.handler(commandContext);
        const disposable = commands.registerCommand(
            `${COMMAND_PREFIX}${cmd.id}`,
            boundHandler
        );
        commandContext.extensionContext.subscriptions.push(disposable);
    });
};
