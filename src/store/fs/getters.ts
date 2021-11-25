import { GetterTree } from "vuex";
import { FsState } from "./types";
import { RootState } from "../types";

export enum fsGetters {
     GET_FILE_PATH = 'fs/GET_FILE_PATH',
     GET_FILE_CONTENT = 'fs/GET_FILE_CONTENT',
     GET_HAS_CHANGED = 'fs/GET_HAS_CHANGED'
}

export const getters: GetterTree<FsState, RootState> = {
    GET_FILE_PATH : state => state.filePath,
    GET_FILE_CONTENT : state => state.fileContent,
    GET_HAS_CHANGED : state => state.hasChanged
}