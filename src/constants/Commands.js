import store from '@/store'

export const COMMANDS = {
    new: (listNames)=>{
        store.commit('editors/addName', listNames)
    },
    kill: (listNames)=>{
        store.commit('editors/kill', listNames)
    },
    test: ()=>{
        console.log(store.getters['editors/getRefs'][0].doc.toString());
    }
}