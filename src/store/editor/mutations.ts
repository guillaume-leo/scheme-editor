import { MutationTree } from "vuex";
import { EditorState } from "./types";
import _ from 'lodash'
import store from '@/store'
import { consoleMutations } from "../console/mutations";

export enum editorMutations {
    UPDATE_SNIPPETS = 'editor/UPDATE_SNIPPETS',
    UPDATE_HOTKEYS = 'editor/UPDATE_HOTKEYS',
    NEW_EDITOR = 'editor/NEW_EDITOR',
    ADD_REFERENCE = 'editor/ADD_REFERENCE',
    UPDATE_CODE = 'editor/UPDATE_CODE',
    DELETE_EDITOR = 'editor/DELETE_EDITOR',
    RENAME_EDITOR = 'editor/RENAME_EDITOR',
    ERASE_EDITORS = 'editor/ERASE_EDITORS',
    COPY_EDITORS = 'editor/COPY_EDITORS',
    PASTE_EDITORS = 'editor/PASTE_EDITORS'
}

export const mutations: MutationTree<EditorState> = {

    UPDATE_SNIPPETS (state, payload){
        state.snippets=payload
    },
    UPDATE_HOTKEYS (state, payload){
        state.hotkeys=payload
    },

    NEW_EDITOR (state, payload){
        state.editors = [
            ...state.editors,
            {
                name: payload.name,
                code: payload.code,
                ref: []
            }
        ]
    },

    ADD_REFERENCE (state, payload){
        const item = state.editors.find(item => item.name === payload.name)
        Object.assign(item, {ref:payload.ref})
    },

    UPDATE_CODE (state, payload) {
        const item = state.editors.find(item => item.name === payload.name)
        Object.assign(item, {code:payload.code})
    },

    DELETE_EDITOR (state, payload) {
        const editorsArr = state.editors
        const index =_.findIndex(editorsArr, o => { return o.name == payload.name })
        if (index === -1) return
        editorsArr.splice(index, 1)
    },

    RENAME_EDITOR (state, payload) {
        const item = state.editors.find(item => item.name === payload.name)
        if (item === undefined) return
        Object.assign(item, {name:payload.newName})
    },

    ERASE_EDITORS (state){
        state.editors = []
    },

    COPY_EDITORS (state, nameArray:string[]){
        state.copy=[]
        nameArray.map((e)=>{
            const index =_.findIndex(state.editors, o => { return o.name === e })
            if (index > -1) {
                const clonedEditor = _.cloneDeep(state.editors[index])
                state.copy = [
                    ...state.copy,
                    clonedEditor
                ]
            }
        })
        const coppiedStuff = _.map(state.copy, 'name')
        store.commit(consoleMutations.PRINT, `${coppiedStuff} have been copied`)
    },

    PASTE_EDITORS(state){
        const names = _.map(state.editors, 'name')
        state.copy.map((e)=>{
            if (!names.includes(e.name)){
                state.editors = [
                    ...state.editors,
                    {
                        name: e.name,
                        code: e.code,
                        ref: []
                    }
                ]
            }else{
                state.editors = [
                    ...state.editors,
                    {
                        name: e.name+'(new)',
                        code: e.code,
                        ref: []
                    }
                ]
            }
        })
    }

}