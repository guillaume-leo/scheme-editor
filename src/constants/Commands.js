import store from '@/store'

export const COMMANDS = {
    new: (listNames)=>{
        store.commit('editors/addName', listNames)
    },
    kill: (listNames)=>{
        store.commit('editors/kill', listNames)
    }
}