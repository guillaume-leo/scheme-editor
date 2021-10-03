export const file = {
    namespaced: true,
    
    state: () => ({
        filePath:'',
        fileContent:'',

    }),

    mutations: {
      ['setFilePath'](state, path){
        state.filePath = path
      }
      },
    
    getters: {
        getFilePath(state){
            return state.filePath
        } 
      },    
}