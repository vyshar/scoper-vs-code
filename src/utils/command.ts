import vscode from 'vscode'
import { CommandContext, CommandDefinition, CommandHandler } from '@/types/Command'

const COMMAND_PREFIX = 'scoper.'

export const defineCommand = <T extends unknown[] = []>(
    id: string,
    handler: (ctx: CommandContext) => CommandHandler<T>
): CommandDefinition<T> => ({
    id,
    handler,
})

export const buildCommands = (context: CommandContext) => (commands: CommandDefinition[]) => {
    return commands.map(({ id, handler }) => {
        const commandId = `${COMMAND_PREFIX}${id}`
        const commandHandler = handler(context)
        return vscode.commands.registerCommand(commandId, commandHandler)
    })
}
