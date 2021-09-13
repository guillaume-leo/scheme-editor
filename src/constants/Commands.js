import store from '@/store'

export const COMMANDS = {
    test: (e)=>{
        console.log("hello from command");
        console.log(e[0])
    },
    new: (listNames)=>{
        store.commit('editors/addName', listNames)
    }
}