import vscode from 'vscode'

import { LocalRepository } from '@/repositories/local.repository'
import { ScopeService } from '@/services/scope.service'
import { SyncService } from '@/services/sync.service'
import { JsonRepository } from '@/repositories/json.repository'
import { buildCommands } from '@/utils/command'
import { CommandContext } from './types/Command'
import { createScopeCommand } from './controllers/createScope'
import { addFileToScopeCommand } from './controllers/addFileToScope'
import { selectActiveScopeCommand } from './controllers/selectActiveScope'
import { removeFileFromScopeCommand } from './controllers/removeFileFromScope'
import { showFileByIndexCommands, showFileCommand } from './controllers/showFile'
import { renameScopeCommand } from './controllers/renameScope'
import { TreeViewService } from './services/treeView.service'
import { StatusBarService } from './services/statusbar.service'
import { showScopeFilesCommand } from './controllers/showScopeFiles'
import { deleteScopeCommand } from './controllers/deleteScope'
import { ChangeEventEmitter } from './types/ChangeEventEmitter'

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    const changeEventEmitter: ChangeEventEmitter = new vscode.EventEmitter()
    const sessionRepository = LocalRepository(context.workspaceState)
    const jsonRepository = JsonRepository()
    const scopeService = ScopeService(sessionRepository, changeEventEmitter)
    const syncService = SyncService(sessionRepository, jsonRepository)
    const treeViewService = TreeViewService(scopeService, changeEventEmitter)
    const statusBarService = StatusBarService(scopeService, changeEventEmitter)

    const commandContext: CommandContext = {
        scopeService,
        syncService,
        treeViewService,
        statusBarService,
    }

    const commandsBuilder = buildCommands(commandContext)
    const commands = commandsBuilder([
        createScopeCommand,
        selectActiveScopeCommand,
        addFileToScopeCommand,
        removeFileFromScopeCommand,
        renameScopeCommand,
        showScopeFilesCommand,
        deleteScopeCommand,
        showFileCommand,
        ...showFileByIndexCommands,
    ])
    context.subscriptions.push(
        ...commands,
        ...treeViewService.disposables(),
        ...statusBarService.disposables(),
        changeEventEmitter
    )
}

export function deactivate(): void {}
