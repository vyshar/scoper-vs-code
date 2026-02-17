import vscode from 'vscode'
import { none, Option, some } from '../data-types/Option'

export const showInput = async (
    placeholder: string,
    options?: Omit<vscode.InputBoxOptions, 'prompt'>
): Promise<Option<string>> => {
    const inputValue = await vscode.window.showInputBox({
        prompt: placeholder,
        ...options,
    })
    return inputValue !== undefined ? some(inputValue) : none
}
