import {StreamLanguage} from "@codemirror/stream-parser"
import { scheme } from "@codemirror/legacy-modes/mode/scheme"
import * as parinfer from 'parinfer'
import store from '@/store'

export const schemeLang = StreamLanguage.define(scheme) 

export const  offsetToPos = (doc, offset) => {
    const line = doc.lineAt(offset)
    return {line: line.number - 1, ch: offset - line.from}
} 

export const parinferLayer = (key, state, view)=>{ //this.vew
    const currentPrevOffset = store.getters['editors/getPrevOffset']
    const cm = state//this.view.state
    const tooltip = cm.values[4].open ? true : false
    const snippet = Object.keys({...cm.values[6]}).includes('ranges')
    if (tooltip || snippet) return
    if (key.ctrlKey || key.shiftKey || key.key === 'Shift'|| key.key === 'Control') return

    const currOffset = cm.selection.main.head
    const currText = cm.doc.toString()
    store.commit('editors/changePrevOffset', currentPrevOffset > cm.doc.length ? cm.doc.length : currentPrevOffset)
    const newPrevOffset = store.getters['editors/getPrevOffset']
        const options = {
            cursorLine:offsetToPos(cm.doc, currOffset).line,
            cursorX: offsetToPos(cm.doc, currOffset).ch,
            prevCursorLine:offsetToPos(cm.doc, newPrevOffset).line,
            prevCursorX:offsetToPos(cm.doc, newPrevOffset).ch,
        }

        const result = parinfer.indentMode(currText,options)
        const {cursorLine, cursorX} = result
        const parinferText = result.text.split('\n')
        let parinferCursor = 0
        for (let i = 0; i < cursorLine;  i++){
            const lineLength = parinferText[i].length === 0 ? 1 : parinferText[i].length + 1
            parinferCursor += lineLength
        }
        parinferCursor += cursorX
        store.commit('editors/changePrevOffset', parinferCursor) 
        view.dispatch({
            changes: {
                from: 0, 
                to: cm.doc.length, 
                insert: result.text
            },
            selection: {
            anchor: parinferCursor
            }
        })
}

