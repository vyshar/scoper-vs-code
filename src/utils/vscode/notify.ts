import vscode from 'vscode'

export const notify = {
    error: (message: string) => vscode.window.showErrorMessage(message),
    info: (message: string) => vscode.window.showInformationMessage(message),
    success: (message: string) => vscode.window.showInformationMessage(message),
}
