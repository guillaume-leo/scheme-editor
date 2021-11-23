import { GetterTree } from "vuex";
import { ConsoleState } from "./types";
import { RootState } from "../types";

export enum consoleGetters {
     GET_DATA = "console/GET_DATA"
}

export const getters: GetterTree<ConsoleState, RootState> = {
    GET_DATA (state){
        const { consoleData } = state  
        return consoleData
    }
}