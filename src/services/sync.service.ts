import { IJsonRepository } from '@/repositories/json.repository'
import { ILocalRepository } from '@/repositories/local.repository'

export interface ISyncService {}
export const SyncService = (sessionRepository: ILocalRepository, jsonRepository: IJsonRepository): ISyncService => {
    return {}
}
