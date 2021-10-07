import { menuActions } from '@/functions/menuActions'


const file = [
    {
        key: 'n',
        label: 'new file',
        children:[],
        action:()=>menuActions.newFileAction()
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
        action:()=>menuActions.loadFileAction(),
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
                action: name=>menuActions.addEditorAction(name)
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
                action: name=>menuActions.deleteEditorAction(name)
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
                action: name=>menuActions.renameEditorAction(name)
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
                action: name=>menuActions.copyEditorAction(name)
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
            key: 't',
            label: 'tree commands',
            children:[]                
        },
        {
            key: 'o',
            label: 'options',
            children:[]                
        }
    ]
}