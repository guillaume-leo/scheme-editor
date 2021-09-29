export const file = {
    namespaced: true,
    
    state: () => ({
        filePath:'',
        fileContent:'',

    }),

    mutations: {

      },
    
    getters: {
        getFilePath(state){
            return state.filePath
        } 
      },    
}