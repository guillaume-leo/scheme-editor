import { Module } from "vuex";
import { FsState } from "./types";
import { RootState } from "../types";
import { getters } from "./getters";
import { mutations } from "./mutations";

export const state: FsState = {
        filePath: '',
        fileContent:[],
        hasChanged:true
}

const namespaced: boolean = true

export const fs: Module <FsState, RootState> = {
    namespaced,
    state,
    getters,
    mutations
}