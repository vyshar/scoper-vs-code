import { createStatusBarItem } from '../views/statusBarItem'
import { IScopeService } from './scope.service'
import { Option } from '@/utils/data-types/Option'
import { pipe } from '@/utils/pipe'

export const StatusBarService = (scopeService: IScopeService) => {
    const scopeName = pipe(
        scopeService.getActiveScope(),
        Option.match(
            (scope) => scope.name,
            () => 'None'
        )
    )

    const statusBarItem = createStatusBarItem(scopeName)

    statusBarItem.show()

    return {
        setActiveScopeName: (scopeName: string) => {
            statusBarItem.text = `$(layers) ${scopeName}`
            statusBarItem.show()
        },
        disposables: () => [statusBarItem],
    }
}

export type IStatusBarService = ReturnType<typeof StatusBarService>
