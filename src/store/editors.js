// import { ADD_EDITOR_TO_REF } from '@/store/mutation-types'
import { THEMES } from '@/constants/Themes'
import store from '@/store'

export const editors = {
    namespaced: true,
    state: () => ({
        refs: [],
        names:[],
        themeIndex: 0,
        themeLabel:''
    }),
    mutations: {
        test (state, e) {
            state.refs.push(e)
        },
        ['addName'](state, list){
            list.forEach(e => {
                state.names = [...state.names, e]
            });
        },

        ['changeTheme'](state){
            state.themeIndex ++
            state.themeLabel = THEMES[state.themeIndex % THEMES.length]
            
            store.commit('console/print', state.themeLabel, { root: true })
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
        }
    }
}