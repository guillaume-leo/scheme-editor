export const info = {
    namespaced: true,
    
    state: () => ({
        focusedEditor:'',
    }),

    mutations: {
        ['focusedEditor'](state, name){
          state.focusedEditor = name
        }
      },
    
    getters: {
        getFocusedEditor(state){
          return state.focusedEditor
        }
      },    
}