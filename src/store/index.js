import { createStore } from 'vuex'
import { SEND_TO_CONSOLE, CLEAR_CONSOLE, CHANGE_EDITOR_THEME } from '@/store/mutation-types'
import { THEMES } from '@/constants/Themes'

export default createStore({
  state: {
    consoleData:[],
    consoleLineNumber:0,
    editorThemeNumber: 0,
    editorTheme:''
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
    },
    [CHANGE_EDITOR_THEME](state){
      state.editorThemeNumber ++
      const lineNb = state.consoleLineNumber ++
      state.consoleData = [{
        lineNumber: lineNb,
        text: `theme: ${THEMES[state.editorThemeNumber % THEMES.length]}`
      }, ...state.consoleData]
      state.editorTheme = THEMES[state.editorThemeNumber % THEMES.length]
    }
  },
  actions: {
  },
  getters: {
    getConsoleData(state){
      return state.consoleData
    },
    getEditorTheme(state){
      return state.editorTheme
    }
  }
})
