import { THEMES } from '@/constants/Themes'
import store from '@/store'
// import _ from 'lodash'

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
        themeIndex: 0,
        themeLabel:'',
        focused:''
    }),
    mutations: {

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

        ['changeTheme'](state){
            state.themeIndex ++
            state.themeLabel = THEMES[state.themeIndex % THEMES.length]
            
            store.commit('console/print', state.themeLabel, { root: true })
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
        getEditors(state){
            return state.refs
        },
        getTheme(state){
            return state.themeLabel
        },
        getNames(state) {
            return state.names
        },
        getFocused(state) {
            return state.focused
        }
    }
}