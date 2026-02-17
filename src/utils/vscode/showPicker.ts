import vscode from 'vscode'
import { Option } from '../data-types/Option'

export const showPicker = async <T>(
    list: T[],
    displayFn: (listItem: T) => string,
    placeHolder?: string
): Promise<Option<T>> => {
    const items = list.map((item) => ({ label: displayFn(item), data: item }))

    const selected = await vscode.window.showQuickPick(items, {
        placeHolder,
    })

    return Option.fromNullable(selected?.data ?? null)
}
