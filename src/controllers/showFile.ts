import vscode from 'vscode'
import { defineCommand } from '@/utils/command'
import { Option } from '@/utils/data-types/Option'
import { Result } from '@/utils/data-types/Result'
import { showPicker } from '@/utils/vscode/showPicker'

const KEY_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as const

export const showFileCommand = (keyNumber: number) =>
    defineCommand(`showFile${keyNumber}`, ({ scopeService }) => async () => {
        const activeScopeOption = scopeService.getActiveScope()

        if (Option.isNone(activeScopeOption)) {
            return vscode.commands.executeCommand('scoper.selectActiveScope')
        }

        const files = scopeService.getScopeFiles(activeScopeOption.value.id)

        if (Result.isErr(files)) {
            return vscode.window.showErrorMessage(files.error)
        }

        if (files.value.length === 0) {
            return vscode.window.showInformationMessage(`Scope "${activeScopeOption.value.name}" has no files`)
        }

        // const selectedFile = await showPicker(
        //     files.value,
        //     (file) => file.split('/').pop() || file,
        //     'Select a file to open'
        // )

        // if (Option.isNone(selectedFile)) {
        //     return
        // }

        const fileUri = vscode.Uri.file(files.value[keyNumber - 1])
        return vscode.window.showTextDocument(fileUri)
    })

export const showFileByIndexCommands = KEY_NUMBERS.map(showFileCommand)
