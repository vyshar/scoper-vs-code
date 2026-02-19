import vscode from 'vscode'

export const notify = {
    error: (message: string): void => {
        vscode.window.showErrorMessage(message)
    },
    info: (message: string): void => {
        vscode.window.showInformationMessage(message)
    },
    success: (message: string): void => {
        vscode.window.showInformationMessage(message)
    },
}
