import { menuActions } from '@/components/command/functions/menuActions'
import store from '@/store'
import { consoleMutations } from '@/store/console/mutations'
import { fsGetters } from '@/store/fs/getters'

const loadConfirm = [
    {
        key: 'l',
        label: 'force load',
        children:[],
        action: ()=>menuActions.loadFileAction(),
        type:'key'
    },
    {
        key: 'a',
        label: 'abort load',
        children:[],
        action: ()=>store.commit(consoleMutations.PRINT, 'command aborted'),
        type:'key'
    }
]

const newFileConfirm = [
    {
        key: 'n',
        label: 'force newFile',
        children:[],
        action: ()=>menuActions.newFileAction(),
        type:'key'
    },
    {
        key: 'a',
        label: 'abort new file',
        children:[],
        action: ()=>store.commit(consoleMutations.PRINT, 'command aborted'),
        type:'key'
    }
]

const file = [
    {
        key: 'n',
        label: 'new file',
        children:[],
        action:()=>{
            const editorHasChanged = store.getters[fsGetters.GET_HAS_CHANGED]
            if (editorHasChanged) {
                store.commit(consoleMutations.PRINT, 'File not saved, do you want to proceed?')
                return newFileConfirm
            }
            menuActions.newFileAction()},
        type:'key'
    },
    {
        key: 's',
        label: 'save',
        children:[],
        action:()=>menuActions.saveAction(),
        type:'key'
    },
    {
        key: 'a',
        label: 'saveAs',
        children:[],
        type: 'key',
        action:()=>menuActions.saveAsAction()
    },
    {
        key: 'l',
        label: 'load',
        children:[],
        action:()=>{
            const editorHasChanged = store.getters[fsGetters.GET_HAS_CHANGED]
            if (editorHasChanged) {
                store.commit(consoleMutations.PRINT, 'File not saved, do you want to proceed?')
                return loadConfirm
            }
            menuActions.loadFileAction()},
        type:'key'
    },
]
const editors = [
    {
        key: "a",
        label: 'add a new editor',
        children:[
            {
                key: 'Enter',
                label: 'Write name and press Enter',
                children:[],
                type: 'key',
                action: (name:string)=>menuActions.addEditorAction(name)
            }
        ],
        type:'word',
    },
    {
        key: 'd',
        label: 'delete editor',
        children:[
            {
                key: 'Enter',
                label: 'Write name and press Enter',
                children:[],
                type: 'key',
                action: (name:string)=>menuActions.deleteEditorAction(name)
            }
        ],
        type: 'word',
    },
    {
        key: 'r',
        label: 'rename editor',
        children:[
            {
                key: 'Enter',
                label: 'Write name and press Enter',
                children:[],
                type: 'key',
                action: (name:string)=>menuActions.renameEditorAction(name)
            }
        ],
        type: 'word',
    },
    {
        key: 'c',
        label: 'copy editor',
        children:[
            {
                key: 'Enter',
                label: 'Write name(s) and press Enter',
                children:[],
                type: 'key',
                action: (name:string)=>menuActions.copyEditorAction(name)
            }
        ],
        type: 'word',
    },
    {
        key: 'p',
        label: 'paste',
        children:[],
        action:()=>menuActions.pasteEditorAction(),
        type:'key'
    }
]

const parse = [
    {
        key: 's',
        label: 'snippets',
        children:[],
        action: ()=>menuActions.parseSnippetsAction(),
        type:'key'
    },
    {
        key: 'h',
        label: 'hotkeys',
        children:[],
        action: ()=>menuActions.parseHotKeysAction(),
        type:'key'
    }
]

export const menu = () =>{
    return [
        {
            key: 'f',
            label: 'file commands',
            children: file,
            type: 'key'
        },
        {
            key: 'e',
            label: 'editor commands',
            children: editors,
            type:'key'               
        },
        {
            key: 'p',
            label: 'parse',
            children: parse, 
            type:'key'               
        }
    ]
}