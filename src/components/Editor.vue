<template>
  <p>{{this.name}}</p>
<div  v-bind="{ id: this.editorId }" @keyup="parinfer" class="editor">
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
import {snippets} from "@/config/snippets"

// import _ from 'lodash'

// import { parseBuffer } from '@/config/parseBuffer'
// import { parseBufferSnippets } from '@/config/parseBufferSnippets'


const  offsetToPos = (doc, offset) => {
  let line = doc.lineAt(offset)
  return {line: line.number - 1, ch: offset - line.from}
} 

export default {
    name:'Editor',
    props:{
      name: String,
      code: String
    },
    data(){
        return{
            editorId: `__${this.name}__`,
            prevOffset: 0,
            codeFromVuex:''
        }
    },
    mounted(){

      // const onChange = EditorView.updateListener.of((obj) => {
      //   if (obj.view.hasFocus) this.$store.commit('info/focusedEditor', this.id)
      //   const cm = this.view.state
      //   const id = this.editorId
      //   const currText = cm.doc.toString()
      //   parseBufferSnippets(currText)
      //   this.$store.commit('editors/sExpr', {
      //     id : id,
      //     sExpr : parseBuffer(currText)
      //     })
      // })

      const onChange = EditorView.updateListener.of((obj) => {
        if (obj.view.hasFocus) this.$store.commit('info/focusedEditor', this.name)
        const cm = this.view.state
        const currText = cm.doc.toString()
        this.$store.commit('editors/updateCode', {
          name: this.name,
          code: currText
        })
      })
      const schemeLang = StreamLanguage.define(scheme) 
      const initialState = EditorState.create({
        doc: this.code,
        extensions: [
          basicSetup,
          schemeLang,
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
        ref: this.view,
        name:this.name
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
      },
    },
    computed:{
      getEditors(){
        return JSON.stringify(this.$store.getters['editors/getEditors'])
      }
    },
    watch:{
      // getEditors: {
        // handler(newVal, oldVal){

        //   const cmName = this.name
        //   const newCode = JSON.parse(newVal)
        //   const oldCode = JSON.parse(oldVal)

        //   const index =_.findIndex(newCode, o => { return o.name == cmName })
        //   if (index === -1) return
        //   if (newCode[index].code === oldCode[index].code) return
        //   console.log(`${cmName} changed`);
          // this.view.dispatch({
          //   changes: {
          //     from: 0, 
          //     to: this.view.state.doc.length, 
          //     insert: newCode[index].code
          //   }
          // })
      //   },
      //   deep: true
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