import vscode from 'vscode'
import { ChangeEventEmitter } from '@/types/ChangeEventEmitter'
import { IScopeService } from './scope.service'
import { Option } from '@/utils/data-types/Option'
import { pipe } from '@/utils/pipe'

export const StatusBarService = (scopeService: IScopeService, changeEventEmitter: ChangeEventEmitter) => {
    const getScopeText = () =>
        pipe(
            scopeService.getActiveScope(),
            Option.match(
                (scope) => `$(layers) ${scope.name ?? 'None'}`,
                () => '$(layers) None'
            )
        )

    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100)
    statusBarItem.tooltip = 'Active Scope'
    statusBarItem.command = 'scoper.selectActiveScope'
    statusBarItem.text = getScopeText()
    statusBarItem.show()

    changeEventEmitter.event((t) => {
        if (t === 'SELECT_ACTIVE_SCOPE' || t === 'RENAME_SCOPE' || t === 'DELETE_SCOPE') {
            statusBarItem.text = getScopeText()
            statusBarItem.show()
        }
    })

    return {
        disposables: () => [statusBarItem],
    }
}

export type IStatusBarService = ReturnType<typeof StatusBarService>
