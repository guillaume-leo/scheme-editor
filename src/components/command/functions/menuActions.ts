import store from '@/store'
import { writeFile, readTextFile } from '@tauri-apps/api/fs'
import { save, open } from '@tauri-apps/api/dialog'
import { parseBufferSnippets } from '../../editor/functions/parseBufferSnippets'
import { parseBufferHotKeys } from '../../editor/functions/parseBufferHotKeys'
import _ from 'lodash'
import { editorMutations } from '@/store/editor/mutations'
import { editorGetters } from '@/store/editor/getters'
import { consoleMutations } from '@/store/console/mutations'
import { editor } from '@/store/editor/types'
import { fsGetters } from '@/store/fs/getters'
import { fsMutations } from '@/store/fs/mutations'



/*
*   ------------
*   FILE ACTIONS
*   ------------
*/

const newFileAction = ()=>{
    // check if editors change, if yes confirm()
    store.commit(editorMutations.ERASE_EDITORS)
    // store.commit('file/eraseFilePath')
}

const saveAction = ()=>{

    const editors: any[] = []
    store.getters[editorGetters.GET_EDITORS].forEach((e:editor) => {
        editors.push({
            name:e.name,
            code:e.code
        })    
    })
    const path = store.getters[fsGetters.GET_FILE_PATH] 
    if (path.length > 0){

        writeFile({
            path: path,
            contents: JSON.stringify(editors)
        }).then(()=>{
            store.commit(fsMutations.SET_FILEPATH, {
                filePath: path,
                fileContent: editors
            })
            store.commit(fsMutations.HAS_CHANGED,false)
            return store.commit(consoleMutations.PRINT, `${path}`)
        })
    }else{
        return saveAsAction()
    }
    
}

const saveAsAction = ()=>{
    const editors: any[] = []
    store.getters[editorGetters.GET_EDITORS].forEach((e:editor) => {
        editors.push({
            name:e.name,
            code:e.code
        })     
    })
    save({
        filters: [{
            name:'',
            extensions: ['json']
        }]  
    })
    .then((e)=>{
        if (e===null) return
        writeFile({
            path: e,
            contents: JSON.stringify(editors)
        }).then(()=>{
            store.commit(fsMutations.SET_FILEPATH, {
                filePath: e,
                fileContent: editors
            })
            store.commit(fsMutations.HAS_CHANGED,false)
            return store.commit(consoleMutations.PRINT, `${e} have been written`)
        })  
    })

    
    
}

const loadFileAction = ()=>{

    store.commit(editorMutations.ERASE_EDITORS)
    open({
        filters: [{
            name:'',
            extensions: ['json']
        }]  
    })
    .then((e)=>{
        if (e===null) return
        readTextFile(e as string)
        .then((text)=>{
            const content = JSON.parse(text)
            content.map((el: { name: any; code: any })=>{
                store.commit(editorMutations.NEW_EDITOR, {
                    name:el.name, 
                    code:el.code
                })
            })
            store.commit(fsMutations.SET_FILEPATH, {
                filePath: e,
                fileContent: content
            })
            
        })
    })
}

/*
*   ---------------
*   EDITORS ACTIONS
*   ---------------
*/

const addEditorAction = (editorName: string)=>{
    const editorsName = store.getters[editorGetters.GET_EDITORS_NAME]
    if (editorsName.includes(editorName)) return store.commit(consoleMutations.PRINT, `error : ${editorName} already exist`)
    store.commit(editorMutations.NEW_EDITOR, {
        name:editorName, 
        code:'(define something 123)'
    })
}

const deleteEditorAction = (editorName: string)=>{
    store.commit(editorMutations.DELETE_EDITOR, {
        name:editorName
        })
}

const renameEditorAction = (text: string)=>{
    const input = text.split(' ')
    store.commit(editorMutations.RENAME_EDITOR, {
        name:input[0],
        newName:input[1]
        })
}

const copyEditorAction = (text: string)=>{
    const input = text.split(' ')
    store.commit(editorMutations.COPY_EDITORS, input)
}

const pasteEditorAction = ()=>{
    store.commit(editorMutations.PASTE_EDITORS)
    parseSnippetsAction()
}

/*
*   ---------------
*   PARSE ACTIONS
*   ---------------
*/

const parseSnippetsAction = ()=>{
    const allEditors = store.getters[editorGetters.GET_EDITORS]
    let snippets: any[] = []
    allEditors.forEach((e: { ref: { state: { doc: any } } })=>{
        if (e.ref) snippets.push(parseBufferSnippets(e.ref.state.doc))
    })
    snippets = _.flatten(snippets).filter((thing, index, self) =>
        index === self.findIndex((t) => (
            t.label === thing.label
        ))
    )
    store.commit(editorMutations.UPDATE_SNIPPETS, snippets)
    snippets.reverse().forEach(e=>{
        store.commit(consoleMutations.PRINT, `${e.label} ○ ${e.code}`)
        
    })
}

const parseHotKeysAction = ()=>{
    const allEditors = store.getters[editorGetters.GET_EDITORS]
    let hotkeys: any[] = []
    allEditors.forEach((e: { ref: { state: { doc: any } } })=>{
        if (e.ref) hotkeys.push(parseBufferHotKeys(e.ref.state.doc, e.ref))
    })
    hotkeys = _.flatten(hotkeys).filter((thing, index, self) =>
        index === self.findIndex((t) => (
            t.hotkey === thing.hotkey
        ))
    )
    store.commit(editorMutations.UPDATE_HOTKEYS, hotkeys)    
    hotkeys.reverse().forEach(e=>{
        store.commit(consoleMutations.PRINT, `${e.hotkey} ○ ${e.code}`)
        
    })
}

export const menuActions = {
    saveAction:         saveAction,
    saveAsAction:       saveAsAction,
    addEditorAction:    addEditorAction,
    deleteEditorAction: deleteEditorAction,
    renameEditorAction: renameEditorAction,
    copyEditorAction:   copyEditorAction,
    pasteEditorAction:  pasteEditorAction,
    newFileAction:      newFileAction,
    loadFileAction:     loadFileAction,
    parseSnippetsAction:parseSnippetsAction,
    parseHotKeysAction: parseHotKeysAction,
}