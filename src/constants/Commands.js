import store from '@/store'
import { currentDir } from '@tauri-apps/api/path'
import {  readDir, writeFile, readTextFile } from '@tauri-apps/api/fs'

import _ from 'lodash'

import { Tree } from '@/functions/tree'


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
        makeChoice()
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
    s: async(fileName)=>{
        resetChoice()
        /*
        1/ file doesn't exist
        2/ file already exist >>> cli
        3/ file exist and we arleady are on the node
        */
        const editors = store.getters['editors/getEditors'].map((e)=>{
            delete e.ref
            return e
        })
        const nodePath = fileName[0].split('/')
        const appPath = await currentDir()
        const fileList = await readDir(appPath)
        const filePath = appPath + nodePath[0] + '.json'
        const getJsonFiles = _.pickBy(fileList, value => {
            return _.endsWith(value.name, nodePath[0]+'.json');
          })
        const isExist = Object.keys(getJsonFiles).length > 0

        
        if (!isExist){ // the file doesn't exist we write a new file and save editors at the root
            const tree = Tree.createRoot(nodePath[0], editors)
            await writeFile({
                path: filePath,
                contents: JSON.stringify(tree)
            })
            store.commit('console/print', `file written ${filePath}`)
            store.commit('file/setFilePath', filePath)
            store.commit('file/setNode', nodePath[0])
            console.log(nodePath[0]);
            return
        } 
        // the file exist, but the app is already attached to another file 
        if (filePath !== store.getters['file/getFilePath']){
            const fileContent = JSON.parse(await readTextFile(filePath))
            const allNodesName = Tree.getAllNodesName(fileContent)
            console.log(allNodesName);
            store.commit('console/print', `⚠⚠⚠${filePath} already exists, this content will be written in a new node at root level, are you ok?(y/n)`)
            const answer = await makeChoice()
            if (answer === 1) {
                const date = new Date().getTime()
                Tree.insert(fileContent, fileName[0],{
                    name: date.toString(),
                    editors: editors
                })
                await writeFile({
                    path: filePath,
                    contents: JSON.stringify(fileContent)
                })
                console.log(fileContent);
                store.commit('file/setFilePath', filePath)
                store.commit('file/setNode', nodePath[0])
            }
        }else{
            console.log(`it's the same`);
        }


    },
    ls: async()=>{

        const path = await currentDir()
        const fileList = await readDir(path)
        
        const getJsonFiles = _.pickBy(fileList, value => {
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