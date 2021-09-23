<template>
  <p>{{this.id}}</p>
<div  v-bind="{ id: this.editorId }" @keyup="parinfer" class="editor">
</div>
</template>

<script>


import * as parinfer from 'parinfer'
// import _ from 'lodash'

//CODEMIRROR 6
import {StreamLanguage} from "@codemirror/stream-parser"
import {keymap} from "@codemirror/view"
import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup"
import { scheme } from "@codemirror/legacy-modes/mode/scheme"
import { oneDark } from '@/config/cm-theme'
import {snippets} from "@/config/snippets"
import {Decoration} from "@codemirror/view"
import {StateField, StateEffect} from "@codemirror/state"

import { parseBuffer } from '@/config/parseBuffer'
import { parseBufferSnippets } from '@/config/parseBufferSnippets'

const addUnderline = StateEffect.define()

const underlineField = StateField.define({
  create() {
    return Decoration.none
  },
  update(underlines, tr) {
    underlines = underlines.map(tr.changes)
    for (let e of tr.effects) if (e.is(addUnderline)) {
      underlines = underlines.update({
        add: [underlineMark.range(e.value.from, e.value.to)]
      })
    }
    return underlines
  },
  provide: f => EditorView.decorations.from(f)
})

const underlineMark = Decoration.mark({class: "cm-blink"})

const underlineTheme = EditorView.baseTheme({
  ".cm-blink": {  animationName: 'blink',
                  animationDuration: '1s',
                  borderRadius:'2.5px',
                }
})


function underlineSelection(view) {
  let effects = view.state.selection.ranges
    .filter(r => !r.empty)
    .map(({from, to}) => addUnderline.of({from, to}))
  if (!effects.length) return false

  if (!view.state.field(underlineField, false))
    effects.push(StateEffect.appendConfig.of([underlineField,
                                              underlineTheme]))
  view.dispatch({effects})
  return true
}

const underlineKeymap = keymap.of([{
  key: "Mod-Enter",
  preventDefault: true,
  run: underlineSelection
}])

const isNumeric = (str) => {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

const  offsetToPos = (doc, offset) => {
  let line = doc.lineAt(offset)
  return {line: line.number - 1, ch: offset - line.from}
}

const incDec = (num) =>{
  document.addEventListener('keydown', (key)=>{
    if (key.altKey && key.ctrlKey && key.shiftKey) return key.key + num
  })
  return num
}

const test = (fn)=>{
  console.log(fn);
}

const keyboardMappings = keymap.of(
[
  {
  key: "Mod-Shift-Alt-ArrowUp",
  preventDefault: true,
  run: ()=>{
    test('up')
    }
  },
  {
  key: "Mod-Shift-Alt-ArrowDown",
  preventDefault: true,
  run: ()=>{
    test('down')
  }
}
])

export default {
    name:'Editor',
    props:{
      id: String
    },
    data(){
        return{
            content: `;%s def\n(define (hello)\n\t(post 'Hello_World 123 "salut"))\n;%s-end`,
            theme:'abbott',
            editorId: `__${this.id}__`,
            prevOffset: 0
        }
    },
    mounted(){

      const onChange = EditorView.updateListener.of((obj) => {
        const selection = obj.state.selection.ranges[0]
        if (obj.view.hasFocus) this.$store.commit('info/focusedEditor', this.id)
        const cm = this.view.state
        const id = this.editorId
        const currText = cm.doc.toString()
        const selectedText = currText.slice(selection.from, selection.to)
        if (isNumeric(selectedText)) console.log(incDec(parseFloat(selectedText)))
        parseBufferSnippets(currText)
        this.$store.commit('editors/sExpr', {
          id : id,
          sExpr : parseBuffer(currText)
          })
      })

      const schemeLang = StreamLanguage.define(scheme) 
      const initialState = EditorState.create({
        doc: this.content,
        extensions: [
          basicSetup,
          schemeLang,
          keyboardMappings,
          underlineKeymap,
          onChange,
          schemeLang.data.of({
          autocomplete: snippets
          }),
          oneDark,
          ],
        
      });


      this.view = new EditorView({
        parent: document.getElementById(this.editorId),
        state: initialState,
      })

      this.$store.commit('editors/addRef', {
        ref: this.view.state,
        editorId:this.editorId
      })


    },
    methods:{
      parinfer(key){
        const cm = this.view.state
        const tooltip = cm.values[4].open ? true : false
        const snippet = Object.keys({...cm.values[6]}).includes('ranges')

        if (tooltip || snippet) return
        if (key.ctrlKey || key.shiftKey || key.key === 'Shift'|| key.key === 'Control') return

        const currOffset = cm.selection.main.head
        const currText = cm.doc.toString()
        this.prevOffset = this.prevOffset > cm.doc.length ? cm.doc.length : this.prevOffset
            const options = {
              cursorLine:offsetToPos(cm.doc, currOffset).line,
              cursorX: offsetToPos(cm.doc, currOffset).ch,
              prevCursorLine:offsetToPos(cm.doc, this.prevOffset).line,
              prevCursorX:offsetToPos(cm.doc, this.prevOffset).ch,
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
            this.prevOffset = parinferCursor
            this.view.dispatch({
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
    },
    computed:{
      getRefs(){
        return  this.$store.getters['editors/getRefs']
      },
      getNames(){
        return this.$store.getters['editors/getNames']
      },
      getsExpr(){
        return this.$store.getters['editors/getsExpr']
      }
    },
    watch:{
      // getsExpr(newVal){
      //   console.log(newVal[0]);
      // }
    },
    unmounted(){
    }

        

    

}
</script>

<style scoped>

.test{
  background-color: aqua !important;
}

p{
  padding: 0;
  margin: 0;
  font-family: monospace;
  color: dimgray;
}



</style>