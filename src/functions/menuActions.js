import store from '@/store'
import { writeFile, readTextFile } from '@tauri-apps/api/fs'
import { save, open } from '@tauri-apps/api/dialog'

export const menuActions = {
    saveAction:         saveAction,
    saveAsAction:       saveAsAction,
    addEditorAction:    addEditorAction,
    deleteEditorAction: deleteEditorAction,
    renameEditorAction: renameEditorAction,
    copyEditorAction:   copyEditorAction,
    pasteEditorAction:  pasteEditorAction,
    newFileAction:      newFileAction,
    loadFileAction:     loadFileAction
}

/*
*   ------------
*   FILE ACTIONS
*   ------------
*/

const newFileAction = ()=>{
    // check if editors change, if yes confirm()
    store.commit('editors/eraseEditors')
    store.commit('file/eraseFilePath')
}

const saveAction = ()=>{
    const editors = store.getters['editors/getEditors'].map((e)=>{ // to be replace by TREE
        delete e.ref
        return e
    })
    const path = store.getters['file/getFilePath'] 
    if (path.length > 0){

        writeFile({
            path: path,
            contents: JSON.stringify(editors)
        }).then(()=>{
            return store.commit('console/print', `${path}`)
        })
    }else{
        return saveAsAction()
    }
    
}

const saveAsAction = ()=>{
    const editors = store.getters['editors/getEditors'].map((e)=>{ // to be replace by TREE
        delete e.ref
        return e
    })
    save({
        filters: [{
            name:'',
            extensions: ['json']
        }]  
    })
    .then((e)=>{
        writeFile({
            path: e,
            contents: JSON.stringify(editors)
        }).then(()=>{
            store.commit('file/setFilePath', e)
            return store.commit('console/print', `${e} have been written`)
        })  
    })

    
    
}

const loadFileAction = ()=>{
    // check if editors change, if yes confirm()
    store.commit('editors/eraseEditors')
    open({
        filters: [{
            name:'',
            extensions: ['json']
        }]  
    })
    .then((e)=>{
        if (e===null) return
        readTextFile(e)
        .then((text)=>{
            const content = JSON.parse(text)
            content.map((el)=>{
                store.commit('editors/newEditor', {
                    name:el.name, 
                    code:el.code
                })
            })
            store.commit('file/setFilePath', e)
        })
    })
}

/*
*   ---------------
*   EDITORS ACTIONS
*   ---------------
*/

const addEditorAction = (editorName)=>{
    const editorsName = store.getters['editors/getEditorsName']
    if (editorsName.includes(editorName)) return store.commit('console/print', `error : ${editorName} already exist`)
    store.commit('editors/newEditor', {
        name:editorName, 
        code:''
    })
}

const deleteEditorAction = (editorName)=>{
    store.commit('editors/deleteEditor', {
        name:editorName
        })
}

const renameEditorAction = (text)=>{
    const input = text.split(' ')
    store.commit('editors/renameEditor', {
        name:input[0],
        newName:input[1]
        })
}

const copyEditorAction = (text)=>{
    const input = text.split(' ')
    store.commit('editors/copyEditors', input)
}

const pasteEditorAction = ()=>{
    store.commit('editors/pasteEditors')
}

