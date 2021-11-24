import { Module } from "vuex";
import { CommandState } from "./types";
import { RootState } from "../types";
import { getters } from "./getters";
import { mutations } from "./mutations";

export const state: CommandState = {
        commandData: [['double Alt', 'menu']],
        inputWord:''
}

const namespaced: boolean = true

export const command: Module <CommandState, RootState> = {
    namespaced,
    state,
    getters,
    mutations
}