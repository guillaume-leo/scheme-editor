
function getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}


export const editors = {
    namespaced: true,
    state: () => ({
        refs: [],
        editorId:[],
        names:[],
        focused:'',
        sExpr:{}
    }),
    mutations: {
        ['sExpr'] (state, obj) {
            state.sExpr = obj.sExpr  
        },

        ['addRef'] (state, obj) {
            state.refs = [...state.refs, obj.ref]
            state.editorId = [...state.editorId, obj.editorId]
        },

        ['focused'] (state, id) {
            state.focused = id
        },        

        ['addName'](state, list){
            list.forEach(e => {
                if (!state.names.includes(e)) state.names = [e, ...state.names]
            });
        },

        ['kill'](state, nameList){
            [...new Set(nameList)].forEach(e => {
                let index = getAllIndexes(state.names, e)
                state.names.splice(index, 1)
                state.refs.splice(index, 1)
                state.editorId.splice(index, 1)
            });          
        }
    },
    getters: {
        getRefs(state){
            return state.refs
        },
        getNames(state) {
            return state.names
        },
        getEditorsId(state){
            return state.editorId
        },
        getsExpr(state){
            return state.sExpr
        }
    }
}