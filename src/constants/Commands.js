import store from '@/store'

export const COMMANDS = {
    new: (editorName)=>{
        const editorsName = store.getters['editors/getEditorsName']
        if (editorsName.includes(editorName[0])) return store.commit('console/print', `error : ${editorName} already exist`)
        store.commit('editors/newEditor', editorName[0])
    },
    del: (name)=>{
        store.commit('editors/deleteEditor', {
            name: name[0]
        })
    },
    test: ()=>{
        console.log(store.getters['editors/getRefs'][0].doc.toString());
    },
    rn: (name)=>{
        store.commit('editors/changeEditorName', {
            name: name[0],
            newName: name[1]
        })
    }
}