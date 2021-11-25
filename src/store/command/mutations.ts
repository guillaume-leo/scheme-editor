import { MutationTree } from "vuex";
import { CommandState } from './types'

export enum commandMutations {
    UPDATE_MENU = 'command/UPDATE_MENU',
    UPDATE_WORD = 'command/UPDATE_WORD',
}

export const mutations: MutationTree<CommandState> = {
    UPDATE_MENU (state, payload){
        state.commandData = payload
    },
    UPDATE_WORD (state, str:string){
        state.inputWord = str
    }
}
