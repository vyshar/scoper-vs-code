import vscode from 'vscode'
import { Option } from '../data-types/Option'

export const showPicker = async <T extends readonly unknown[]>(
    list: T,
    displayFn: (listItem: T[number]) => string,
    placeHolder?: string
): Promise<Option<T[number]>> => {
    const items = list.map((item) => ({ label: displayFn(item), data: item }))

    const selected = await vscode.window.showQuickPick(items, {
        placeHolder,
    })

    return Option.fromNullable(selected?.data)
}
