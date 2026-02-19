import { basename } from 'node:path'
import vscode from 'vscode'
import { defineCommand } from '@/utils/command'
import { Option } from '@/utils/data-types/Option'
import { Result } from '@/utils/data-types/Result'
import { showPicker } from '@/utils/vscode/showPicker'
import { notify } from '@/utils/vscode/notify'

export const showScopeFilesCommand = defineCommand('showScopeFiles', ({ scopeService }) => async () => {
    const activeScopeOption = scopeService.getActiveScope()

    if (Option.isNone(activeScopeOption)) {
        await vscode.commands.executeCommand('scoper.selectActiveScope')
        return
    }

    const files = scopeService.getScopeFiles(activeScopeOption.value.id)

    if (Result.isErr(files)) {
        return notify.error(files.error)
    }

    if (files.value.length === 0) {
        vscode.window.showInformationMessage(`Scope "${activeScopeOption.value.name}" has no files`)
        return
    }

    const selectedFile = await showPicker(files.value, (file) => basename(file), 'Select a file to open')

    if (Option.isNone(selectedFile)) {
        return
    }

    await vscode.window.showTextDocument(vscode.Uri.file(selectedFile.value))
})
