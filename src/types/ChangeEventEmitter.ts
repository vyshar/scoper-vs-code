import vscode from 'vscode'

export type ScopeChangeEvent =
    | 'CREATE_SCOPE'
    | 'DELETE_SCOPE'
    | 'RENAME_SCOPE'
    | 'SELECT_ACTIVE_SCOPE'
    | 'ADD_FILE_TO_SCOPE'
    | 'REMOVE_FILE_FROM_SCOPE'
    | 'MOVE_FILE_IN_SCOPE'

export type ChangeEventEmitter = vscode.EventEmitter<ScopeChangeEvent>
