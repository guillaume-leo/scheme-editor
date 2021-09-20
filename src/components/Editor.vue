<template>
  <p>{{this.id}}</p>
<div  v-bind="{ id: this.editorId }" class="editor">
</div>
</template>

<script>


import * as parinfer from 'parinfer'
// import _ from 'lodash'

//CODEMIRROR 6
import {StreamLanguage} from "@codemirror/stream-parser"
import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup"
import { scheme } from "@codemirror/legacy-modes/mode/scheme"
import { oneDark } from '@/config/cm-theme'

import {snippetCompletion} from "@codemirror/autocomplete"

const text =
`
(define (hello)
  (post 'Hello_World))
`

export default {
    name:'Editor',
    props:{
      id: String
    },
    data(){
        return{
            content: text,
            theme:'abbott',
            editorId: `__${this.id}__`
        }
    },
    mounted(){


//  PARINFER START

function offsetToPos(doc, offset) {
  let line = doc.lineAt(offset)
  return {line: line.number - 1, ch: offset - line.from}
}

let prevOffset = 0
document.getElementById(this.editorId).addEventListener('keyup', (key)=>{
  const tooltip = this.view.state.values[4].open ? true : false
  const snippet = this.view.state.values[6].ranges ? true : false
  if (tooltip || snippet) return
  if (key.ctrlKey || key.shiftKey || key.key === 'Shift'|| key.key === 'Control') return
  const cm = this.view.state
  const currOffset = cm.selection.main.head
  const currText = cm.doc.toString()
  prevOffset = prevOffset > cm.doc.length ? cm.doc.length : prevOffset
      const options = {
        cursorLine:offsetToPos(cm.doc, currOffset).line,
        cursorX: offsetToPos(cm.doc, currOffset).ch,
        prevCursorLine:offsetToPos(cm.doc, prevOffset).line,
        prevCursorX:offsetToPos(cm.doc, prevOffset).ch,
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
      prevOffset = parinferCursor
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
})

//  PARINFER END
const schemeLang = StreamLanguage.define(scheme) 
const initialState = EditorState.create({
  doc: 
`
(define (hello)
  (post 'Hello_World))
`,
  extensions: [
    basicSetup,
    schemeLang,
    schemeLang.data.of({
    autocomplete: [
      snippetCompletion(
`(define (#{name})
  (post #{name}))#{}`, 
        {
          label: 'define',
          detail: 'this is something'
        })
    ]
    }),
    oneDark,
    ],
});


  this.view = new EditorView({
  parent: document.getElementById(this.editorId),
  state: initialState,
});


    },
    methods:{

    },
    computed:{
        getTheme(){
            return this.$store.getters['editors/getTheme']
        },
        getRefs(){
          return this.$store.getters['editors/getEditors']
        },
        getNames(){
          return this.$store.getters['editors/getNames']
        }
    },
    watch:{

    },
    unmounted(){
    }

        

    

}
</script>

<style scoped>

.editor{
/* height: 100%; */
}
p{
  padding: 0;
  margin: 0;
  font-family: monospace;
  color: dimgray;
}

</style>