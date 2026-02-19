import { IScopeService } from '@/services/scope.service'

export interface CommandContext {
    scopeService: IScopeService
}

export type CommandHandler<T extends unknown[] = []> = (...args: T) => Promise<void> | void

export interface CommandDefinition<T extends unknown[] = []> {
    readonly id: string
    readonly handler: (ctx: CommandContext) => CommandHandler<T>
}
