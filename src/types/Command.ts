import vscode from 'vscode'
import { IScopeService } from '@/services/scope.service'
import { ISyncService } from '@/services/sync.service'
import { ITreeViewService } from '@/services/treeView.service'
import { IStatusBarService } from '@/services/statusbar.service'

export interface CommandContext {
    scopeService: IScopeService
    syncService: ISyncService
    treeViewService: ITreeViewService
    statusBarService: IStatusBarService
    ctx: vscode.ExtensionContext
}

export type CommandHandler<T extends unknown[] = []> = (...args: T) => Promise<unknown> | unknown

export interface CommandDefinition<T extends unknown[] = []> {
    readonly id: string
    readonly handler: (ctx: CommandContext) => CommandHandler<T>
}
