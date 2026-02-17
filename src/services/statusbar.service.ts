import { ExtensionContext } from 'vscode'
import { createStatusBarItem } from '../views/statusBarItem'
import { IScopeService } from './scope.service'
import { Option } from '@/utils/data-types/Option'
import { pipe } from '@/utils/pipe'

const DEFAULT_SCOPE_NAME = 'None'

export const StatusBarService = (context: ExtensionContext, scopeService: IScopeService) => {
    const scopeName = pipe(
        scopeService.getActiveScope(),
        Option.match(
            (scope) => scope.name,
            () => DEFAULT_SCOPE_NAME
        )
    )

    const statusBarItem = createStatusBarItem(scopeName)

    statusBarItem.show()

    context.subscriptions.push(statusBarItem)

    return {
        updateActiveScope: (scopeName: string) => {
            statusBarItem.text = `$(layers) ${scopeName}`
            statusBarItem.show()
        },
    }
}

export type IStatusBarService = ReturnType<typeof StatusBarService>
