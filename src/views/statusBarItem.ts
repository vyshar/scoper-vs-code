import { StatusBarAlignment, StatusBarItem, window } from 'vscode'

const DEFAULT_SCOPE_NAME = 'None'

export const createStatusBarItem = (activeScopeName?: string): StatusBarItem => {
    const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, 100)

    statusBarItem.tooltip = 'Active Scope'
    statusBarItem.command = 'scoper.selectActiveScope'
    statusBarItem.text = `$(layers) ${activeScopeName ?? DEFAULT_SCOPE_NAME}`

    return statusBarItem
}
