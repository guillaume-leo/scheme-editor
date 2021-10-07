import _ from 'lodash'
import store from '@/store'

export const editors = {
    namespaced: true,
    state: () => ({
        editors:[],
        storedEditors:[],
        copy:[]
    }),
    mutations: {
        ['sExpr'] (state, obj) {
            state.sExpr = obj.sExpr  
        },

        ['newEditor'](state, payload){
            state.editors = [
                ...state.editors,
                {
                    name: payload.name,
                    code: payload.code,
                    ref: {}
                }
            ]
        },

        ['eraseEditors'](state){
            state.editors = []
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
            editorsArr.splice(index, 1)
        },

        ['renameEditor'] (state, payload) {
            const item = state.editors.find(item => item.name === payload.name)
            if (item === undefined) return
            Object.assign(item, {name:payload.newName})
        },

        ['copyEditors'] (state, nameArray){
            state.copy=[]
            nameArray.map((e)=>{
                const index =_.findIndex(state.editors, o => { return o.name === e })
                if (index > -1) {
                    const clonedEditor = _.cloneDeep(state.editors[index])
                    state.copy = [
                        ...state.copy,
                        clonedEditor
                    ]
                }
            })
            const coppiedStuff = _.map(state.copy, 'name')
            store.commit('console/print', `${coppiedStuff} have been copied`)
        },

        ['pasteEditors'](state){
            const names = _.map(state.editors, 'name')
            state.copy.map((e)=>{
                if (!names.includes(e.name)){
                    state.editors = [
                        ...state.editors,
                        {
                            name: e.name,
                            code: e.code,
                            ref: {}
                        }
                    ]
                }else{
                    state.editors = [
                        ...state.editors,
                        {
                            name: e.name+'(new)',
                            code: e.code,
                            ref: {}
                        }
                    ]
                }
            })
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