import store from '@/store'


let choice = -1

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  
const makeChoice = async()=>{
    choice = 0
    while (choice === 0) {
        console.log('waiting for an answer');
        await sleep(100);
    }
    if (choice !== -1) return choice 
}

const resetChoice = ()=>{
    choice = -1
} 

export const COMMANDS = {
    q: async()=>{
        store.commit('console/print', `Are you sure?`)
        const answer = await makeChoice()
        store.commit('console/print', `your choice is : ${answer}`)
        choice = -1
    },
    new: (editorName)=>{
        resetChoice()
        const editorsName = store.getters['editors/getEditorsName']
        if (editorsName.includes(editorName[0])) return store.commit('console/print', `error : ${editorName} already exist`)
        store.commit('editors/newEditor', editorName[0])
    },
    del: (name)=>{
        resetChoice()
        store.commit('editors/deleteEditor', {
            name: name[0]
        })
    },
    test: ()=>{
        resetChoice()
        console.log(store.getters['editors/getRefs'][0].doc.toString());
    },
    rn: (name)=>{
        resetChoice()
        store.commit('editors/changeEditorName', {
            name: name[0],
            newName: name[1]
        })
    },
    y: ()=>{
        choice = 1
    },
    n: ()=>{
        choice = 2
    }
}