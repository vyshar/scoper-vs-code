import vscode from 'vscode'
import { defineCommand } from '@/utils/command'
import { Option } from '@/utils/data-types/Option'
import { Result } from '@/utils/data-types/Result'
import { notify } from '@/utils/vscode/notify'

const KEY_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as const

export const showFileByIndexCommand = (keyNumber: number) =>
    defineCommand(`showFile${keyNumber}`, ({ scopeService }) => async () => {
        const activeScopeOption = scopeService.getActiveScope()

        if (Option.isNone(activeScopeOption)) {
            return vscode.commands.executeCommand('scoper.selectActiveScope')
        }

        const files = scopeService.getScopeFiles(activeScopeOption.value.id)

        if (Result.isErr(files)) {
            return notify.error(files.error)
        }

        if (files.value.length === 0) {
            return vscode.window.showInformationMessage(`Scope "${activeScopeOption.value.name}" has no files`)
        }

        const indexToShow = keyNumber === 0 ? 9 : keyNumber - 1
        if (indexToShow >= files.value.length) {
            return notify.error(`There are only ${files.value.length} files in the active scope`)
        }

        const fileUri = vscode.Uri.file(files.value[indexToShow])
        return vscode.window.showTextDocument(fileUri)
    })

export const showFileByIndexCommands = KEY_NUMBERS.map(showFileByIndexCommand)

export const showFileCommand = defineCommand('showFile', ({}) => async (path?: string) => {
    if (!path) {
        return notify.error('No file path provided')
    }
    const fileUri = vscode.Uri.file(path)
    return vscode.window.showTextDocument(fileUri)
})
