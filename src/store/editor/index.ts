import { Module } from "vuex";
import { EditorState } from "./types";
import { RootState } from "../types";
import { getters } from "./getters";
import { mutations } from "./mutations";

export const state: EditorState = {
    editors:[],
    snippets:[],
    hotkeys:[],
    copy:[]
}

const namespaced: boolean = true

export const editor: Module <EditorState, RootState> = {
    namespaced,
    state,
    getters,
    mutations
}