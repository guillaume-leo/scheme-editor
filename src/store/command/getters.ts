import { GetterTree } from "vuex";
import { CommandState } from "./types";
import { RootState } from "../types";

export enum CommandGetters {
     GET_DATA = "command/GET_DATA",
     GET_WORD = 'command/GET_WORD'
}

export const getters: GetterTree<CommandState, RootState> = {
    GET_DATA : state => state.commandData,
    GET_WORD : state => state.inputWord
}