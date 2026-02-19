import { basename } from 'node:path'
import vscode from 'vscode'
import { defineCommand } from '@/utils/command'
import { Option } from '@/utils/data-types/Option'
import { Result } from '@/utils/data-types/Result'
import { notify } from '@/utils/vscode/notify'

export const addFileToScopeCommand = defineCommand('addFileToScope', ({ scopeService }) => async () => {
    const currentlyOpenedFile = vscode.window.activeTextEditor?.document.uri.fsPath

    if (!currentlyOpenedFile) {
        return notify.error('No file is currently opened')
    }

    const activeScopeOption = scopeService.getActiveScope()

    if (Option.isNone(activeScopeOption)) {
        await vscode.commands.executeCommand('scoper.selectActiveScope')
        return
    }

    const addFileResult = await scopeService.addFileToScope(activeScopeOption.value.id, currentlyOpenedFile)

    if (Result.isErr(addFileResult)) {
        return notify.error(addFileResult.error)
    }

    return notify.success(`File "${basename(currentlyOpenedFile)}" added to scope "${activeScopeOption.value.name}"`)
})
