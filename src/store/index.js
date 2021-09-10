import { createStore } from 'vuex'
import { SEND_TO_CONSOLE, CLEAR_CONSOLE } from '@/store/mutation-types'

export default createStore({
  state: {
    consoleData:[],
    consoleLineNumber:0,
  },
  mutations: {
    [SEND_TO_CONSOLE](state, e){
      const lineNb = state.consoleLineNumber ++
      state.consoleData = [{
        lineNumber: lineNb,
        text: e
      }, ...state.consoleData]
      if (state.consoleData.length>100) {
        state.consoleData = state.consoleData.slice(0,100)}
      },
    [CLEAR_CONSOLE](state){
      state.consoleData = []
    }
  },
  actions: {
  },
  getters: {
    getConsoleData(state){
      return state.consoleData
    }
  }
})
