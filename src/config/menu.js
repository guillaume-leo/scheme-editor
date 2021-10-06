import store from '@/store'

const saveAs = (name)=>{
    store.commit('console/print', `${name}.json have been written`)
}

const addEditor = (editorName)=>{
    const editorsName = store.getters['editors/getEditorsName']
    if (editorsName.includes(editorName)) return store.commit('console/print', `error : ${editorName} already exist`)
    store.commit('editors/newEditor', editorName)
}

const loadConfirm =[
        {
            key: 'l',
            label: `don't save actual session`,
            children:[]
        },
        {
            key: 's',
            label: `save before load`,
            children:[]
        },
    ]


const file = [
    {
        key: 'n',
        label: 'new file',
        children:[],
        action:()=>{console.log('new file created')}
    },
    {
        key: 's',
        label: 'save',
        children:[],
        action:()=>{console.log('saved!!!')}
    },
    {
        key: 'a',
        label: 'saveAs',
        children:[
            {
                key: 'Enter',
                label: 'Write name and press Enter',
                children:[],
                type: 'key',
                action:word=>saveAs(word),
            }
        ],
        type: 'word',
    },
    {
        key: 'l',
        label: 'load',
        children:[],
        action:()=>loadConfirm,
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
                action: name=>addEditor(name)
            }
        ],
        type:'word',
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