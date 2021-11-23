import { GetterTree } from "vuex";
import { EditorState } from "./types";
import { RootState } from "../types";
import _ from 'lodash'

export enum editorGetters {
    GET_SNIPPETS = 'editor/GET_SNIPPETS',
    GET_HOTKEYS = 'editor/GET_HOTKEYS',
    GET_EDITORS_NAME = 'editor/GET_EDITORS_NAME',
    GET_EDITORS = 'editors/GET_EDITORS'
}

export const getters: GetterTree<EditorState, RootState> =  {

    GET_SNIPPETS : state => state.snippets,

    GET_HOTKEYS : state => state.hotkeys,

    GET_EDITORS_NAME : state => _.map(state.editors, 'name'),

    GET_EDITORS : state => state.editors
}