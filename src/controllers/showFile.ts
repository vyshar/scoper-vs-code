import vscode from 'vscode'
import { defineCommand } from '@/utils/command'
import { Option } from '@/utils/data-types/Option'
import { Result } from '@/utils/data-types/Result'
import { notify } from '@/utils/vscode/notify'

const KEY_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as const
const LAST_FILE_INDEX = 9

export const showFileByIndexCommand = (keyNumber: number) =>
    defineCommand(`showFile${keyNumber}`, ({ scopeService }) => async () => {
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

        const indexToShow = keyNumber === 0 ? LAST_FILE_INDEX : keyNumber - 1
        if (indexToShow >= files.value.length) {
            return notify.error(`There are only ${files.value.length} files in the active scope`)
        }

        await vscode.window.showTextDocument(vscode.Uri.file(files.value[indexToShow]))
    })

export const showFileByIndexCommands = KEY_NUMBERS.map(showFileByIndexCommand)

export const showFileCommand = defineCommand('showFile', (_ctx) => async (path?: string) => {
    if (!path) {
        return notify.error('No file path provided')
    }
    await vscode.window.showTextDocument(vscode.Uri.file(path))
})
