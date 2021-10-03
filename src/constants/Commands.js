import store from '@/store'
import { currentDir } from '@tauri-apps/api/path'
import { writeFile, readDir } from '@tauri-apps/api/fs'

import _ from 'lodash'
import { insertNodeIntoTree, removeNode } from '@/functions/tree'

const tree = 
{
    "name": 'root',
    "level": 0,
    "children": []
}

insertNodeIntoTree(tree, 'root', {
    name: 'Guillaume',
    editors:['a','b','c']
})

insertNodeIntoTree(tree, 'root', {
    name: 'Bernard Friot',
    editors:['a','b','c']
})

insertNodeIntoTree(tree, 'Guillaume', {
    name: 'Merlin',
    editors:['a','b','c']
})

insertNodeIntoTree(tree, 'Guillaume', {
    name: 'Eleonore',
    editors:['a','b','c']
})

removeNode(tree, 'Merlin')

console.log(tree);


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
    },
    rn: (name)=>{
        resetChoice()
        const editorsName = store.getters['editors/getEditorsName']
        if (editorsName.includes(name[1])) return store.commit('console/print', `error : ${name[1]} already exist`)
        store.commit('editors/changeEditorName', {
            name: name[0],
            newName: name[1]
        })
    },
    save: async(fileName)=>{
        const editorsContent = store.getters['editors/getEditors'].map((e)=>{
            delete e.ref
            return e
        })
        const appPath = await currentDir()
        const filePath = store.getters['file/getFilePath']
        if (appPath+fileName[0]+'.json' !== filePath) {
            store.commit('console/print', `⚠_Attention!_⚠ you're trying to save this to another file,
            if this file exist, its content will be overwritten. Do you want to proceed?(y/n)`)
            const answer = await makeChoice()
            if (answer === 1) { // if YES
                await writeFile({
                    path:appPath+fileName[0]+'.json',
                    contents: JSON.stringify(editorsContent)
                    
                })
                store.commit('file/setFilePath', appPath+fileName[0]+'.json')
                store.commit('console/print', appPath+fileName[0]+'.json')
                choice = -1
                return
            }
            // if NO
            store.commit('console/print', `command aborded :)`)
            choice = -1
            return
        }
        await writeFile({
            path:appPath+fileName[0]+'.json',
            contents: JSON.stringify(editorsContent)
            
        })
        store.commit('file/setFilePath', appPath+fileName[0]+'.json')
        store.commit('console/print', appPath+fileName[0]+'.json')
        choice = -1
        return
    },
    ls: async()=>{

        const path = await currentDir()
        const fileList = await readDir(path)
        
        var getJsonFiles = _.pickBy(fileList, value => {
            return _.endsWith(value.name, "json");
          })
        
        _.pickBy(getJsonFiles, (value)=>{
            store.commit('console/print', value.name)
        })
        
    },
    y: ()=>{
        choice = 1
    },
    n: ()=>{
        choice = 2
    }
}


// q: async()=>{
//     store.commit('console/print', `Are you sure?`)
//     const answer = await makeChoice()
//     store.commit('console/print', `your choice is : ${answer}`)
//     choice = -1
// },