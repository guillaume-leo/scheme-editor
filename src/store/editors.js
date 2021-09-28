import _ from 'lodash'

export const editors = {
    namespaced: true,
    state: () => ({
        refs: [],
        editorId:[],
        names:[],
        focused:'',
        sExpr:{},
        editors:[]
    }),
    mutations: {
        ['sExpr'] (state, obj) {
            state.sExpr = obj.sExpr  
        },

        ['newEditor'](state, editorName){
            state.editors = [
                ...state.editors,
                {
                    name: editorName,
                    code: '(something)',
                    ref: {}
                }
            ]
        },

        ['addRef'] (state, payload) {
            const item = state.editors.find(item => item.name === payload.name)
            Object.assign(item, {ref:payload.ref})
        },

        ['updateCode'] (state, payload) {
            const item = state.editors.find(item => item.name === payload.name)
            Object.assign(item, {code:payload.code})
        },

        ['deleteEditor'] (state, payload) {
            const editorsArr = state.editors
            const index =_.findIndex(editorsArr, o => { return o.name == payload.name })
            if (index === -1) return
            console.log(editorsArr[index])
            editorsArr.splice(index, 1)
            console.log(editorsArr);
        },

        ['changeEditorName'] (state, payload) {
            const item = state.editors.find(item => item.name === payload.name)
            if (item === undefined) return
            Object.assign(item, {name:payload.newName})
            console.log(state.editors);
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
        },
        getEditorsName(state){
            return _.map(state.editors, 'name')
        },
        getEditors(state){
            return state.editors
        }
    }
}