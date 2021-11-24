import { menu } from './menu'
import _ from 'lodash'
import store from '@/store'
import { commandMutations } from '@/store/command/mutations'
import { editorGetters } from '@/store/editor/getters'

let pressed: string,
    lastPressed: string,
    isDoublePress: boolean,
    word: string = '', 
    prevWord: string,
    infoPanel: any[][] = [['double Alt', 'menu']],
    storedRef:any[any]

const cmdSystem = async (cmd:any[], type:string ):Promise<any>=>{
    
    
    infoPanel = await cmd.map(e=>[e.key,e.label])
    store.commit(commandMutations.UPDATE_MENU, infoPanel)
    const answer: any  = await new Promise((resolve) => {
        
        window.onkeydown = (e:KeyboardEvent)=>{
            if (infoPanel[0][0] ==='double Alt') return
            if (type === 'key') {
                resolve(e)
            }else{
                if (e.key === 'Enter') {
                    resolve({key:e.key, payload: word})
                    }
                if (e.key.length === 1) {
                    word += e.key
                    store.commit(commandMutations.UPDATE_WORD, word)
                }
                if (e.key === 'Backspace') {
                    word = word.slice(0, -1)
                    store.commit(commandMutations.UPDATE_WORD, word)
                }
            }
            
        }
    })
    const nextCommand = _.findIndex(cmd, (e)=>e.key===answer.key)

    if (nextCommand === -1) {
        setTimeout(() => {
            storedRef.contentDOM?.focus()
        }, 150);
        infoPanel = [['⚠error⚠', 'wrong command']]
        store.commit(commandMutations.UPDATE_MENU, infoPanel)
        return
    }
    if (cmd[nextCommand].action) {
        prevWord = word
        const action = cmd[nextCommand].action(prevWord)
        if (typeof action === 'object') return await cmdSystem(action, cmd[nextCommand].type)
        infoPanel = [['double Alt','menu']]
        store.commit(commandMutations.UPDATE_MENU, infoPanel)
        word = ''
        store.commit(commandMutations.UPDATE_WORD, word)
        setTimeout(() => {
            storedRef.contentDOM?.focus()
        }, 150);
        return
    } 

    return await cmdSystem(cmd[nextCommand].children, cmd[nextCommand].type)
}





const handleDoublePressAlt = (key: KeyboardEvent) => {
    if (key.key === 'Alt') {
        cmdSystem(menu(), 'key')
        if (store.getters[editorGetters.GET_FOCUSED_EDITOR]) storedRef = store.getters[editorGetters.GET_FOCUSED_EDITOR]
        storedRef.contentDOM?.blur()
    }
}

const timeOut = () => setTimeout(() => isDoublePress = false, 250);

export const keyPress = (key : KeyboardEvent) => {
    
    pressed = key.code;

    if (isDoublePress && pressed === lastPressed) {
        isDoublePress = false;
        handleDoublePressAlt(key);
    } else {
        isDoublePress = true;
        timeOut();
    }
    
    lastPressed = pressed;
}




