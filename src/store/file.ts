export const file = {
    namespaced: true,
    
    state: () => ({
        filePath:'',
        node: '',
        fileContent:[],
        hasChanged:null
    }),

    mutations: {
      ['setFilePath'](state, payload){
        state.filePath = payload.filePath
        state.fileContent = payload.fileContent
      },

      ['eraseFilePath'](state){
        state.filePath=''
      },
      
      ['setNode'](state, node){
        state.node = node
      },

      ['hasChanged'](state, val){
        state.hasChanged = val
      }

    },
    
    getters: {
      getFilePath(state){
        return state.filePath
      },
      getFileContent(state){
        return state.fileContent
      },
      getNode(state){
        return state.node
      },
      getFileHasChanged(state){
        return state.hasChanged
      }  
    },    
}