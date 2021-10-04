export const file = {
    namespaced: true,
    
    state: () => ({
        filePath:'',
        node: '',
        fileContent:'',

    }),

    mutations: {
      ['setFilePath'](state, path){
        state.filePath = path
      },
      
      ['setNode'](state, node){
        state.node = node
      }
    },
    
    getters: {
      getFilePath(state){
          return state.filePath
      },
      getNode(state){
        return state.node
      }  
    },    
}