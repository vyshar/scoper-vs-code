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
        return vscode.commands.executeCommand('scoper.selectActiveScope')
    }

    const addFileResult = await scopeService.addFileToScope(activeScopeOption.value.id, currentlyOpenedFile)
    const filename = currentlyOpenedFile.split('/').pop()

    if (Result.isErr(addFileResult)) {
        return notify.error(addFileResult.error)
    }

    return notify.success(`File "${filename}" added to scope "${activeScopeOption.value.name}"`)
})
