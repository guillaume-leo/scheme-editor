export const console = {
    namespaced: true,
    
    state: () => ({
        consoleData:[],
        consoleLineNumber:0
    }),

    mutations: {
        ['print'](state, e){
          const lineNb = state.consoleLineNumber ++
          state.consoleData = [{
            lineNumber: lineNb,
            text: e
          }, ...state.consoleData]
          if (state.consoleData.length>100) {
            state.consoleData = state.consoleData.slice(0,100)}
          },
        ['clear'](state){
          state.consoleData = []
        }
      },
    
    getters: {
        getData(state){
          return state.consoleData
        },
        getLineNumber(state){
            return state.consoleLineNumber
        }
      },    
}