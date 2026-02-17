import { StatusBarAlignment, StatusBarItem, window } from 'vscode'

export const createStatusBarItem = (activeScopeName?: string): StatusBarItem => {
    const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, 100)

    statusBarItem.tooltip = 'Active Scope'
    statusBarItem.command = 'scoper.selectActiveScope'
    statusBarItem.text = `$(layers) ${activeScopeName ?? 'None'}`

    return statusBarItem
}
