import { defineCommand } from '@/utils/command'
import { showInput } from '@/utils/vscode/showInput'
import { Option } from '@/utils/data-types/Option'
import { Result } from '@/utils/data-types/Result'
import { notify } from '@/utils/vscode/notify'
import { createScopeNameValidator } from '@/utils/validators/scopeNameValidator'

export const createScopeCommand = defineCommand(
    'createScope',
    ({ scopeService, statusBarService, treeViewService }) =>
        async () => {
            const scopeNameValidator = createScopeNameValidator(scopeService)
            const scopeNameOption = await showInput('Enter scope name', {
                validateInput: scopeNameValidator,
            })

            if (Option.isNone(scopeNameOption)) {
                return
            }

            const scopeName = scopeNameOption.value.trim()
            const createResult = await scopeService.createScope(scopeName)
            if (Result.isErr(createResult)) {
                return notify.error(createResult.error)
            }

            const activateResult = await scopeService.setActiveScope(createResult.value)
            if (Result.isErr(activateResult)) {
                return notify.error(activateResult.error)
            }

            statusBarService.setActiveScopeName(scopeName)
            treeViewService.refresh()

            return notify.success(`Scope "${scopeName}" created and activated`)
        }
)
