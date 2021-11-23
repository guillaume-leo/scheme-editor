import { MutationTree } from "vuex";
import { ConsoleState } from './types'

export enum consoleMutations {
    PRINT = "console/PRINT",
}

export const mutations: MutationTree<ConsoleState> = {
    PRINT (state, text: string){
        const lineNb = state.consoleLineNumber ++
        state.consoleData = [{
            lineNumber: lineNb,
            text: text
          }, ...state.consoleData]
          if (state.consoleData.length>100) {
            state.consoleData = state.consoleData.slice(0,100)}
    },
}
