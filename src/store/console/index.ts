import { Module } from "vuex";
import { ConsoleState } from "./types";
import { RootState } from "../types";
import { getters } from "./getters";
import { mutations } from "./mutations";

export const state: ConsoleState = {
        consoleData: [],
        consoleLineNumber:0
}

const namespaced: boolean = true

export const console: Module <ConsoleState, RootState> = {
    namespaced,
    state,
    getters,
    mutations
}