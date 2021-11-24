import { MutationTree } from "vuex";
import { FsState } from './types'

export enum fsMutations {
    SET_FILEPATH = 'fs/SET_FILEPATH',
    ERASE_FILE_PATH = 'fs/ERASE_FILE_PATH',
    HAS_CHANGED = 'fs/HAS_CHANGED'

}

export const mutations: MutationTree<FsState> = {
    SET_FILEPATH (state, payload){
        state.filePath = payload.filePath
        state.fileContent = payload.fileContent
    },
    ERASE_FILE_PATH (state){
        state.filePath=''
    },
    HAS_CHANGED (state, val:boolean){
        state.hasChanged = val
    }
}
