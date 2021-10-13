<template>
  <p>{{this.name}}</p>
<div  v-bind="{ id: this.editorId }" @keyup="parinfer" class="editor">
</div>
</template>

<script>


// import _ from 'lodash'

//CODEMIRROR 6
import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup"
import { schemeLang } from '@/config/editors'
import { oneDark } from '@/config/cm-theme'
import {snippets} from "@/config/snippets"
import {keymap} from "@codemirror/view"

import { WSsend } from '@/config/osc'
// import _ from 'lodash'

// import { parseBuffer } from '@/config/parseBuffer'
// import { parseBufferSnippets } from '@/config/parseBufferSnippets'



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

/*
          start === 0 ? 0 : start --
          let end = /\n\(/.exec(afterCursor)
          end === null ? 
            end = currText.length 
            : end = end.index + beforeCursor.length
          const sExp = start < currOffset && currOffset + 1 < end ? 
            currText.slice(start,end) 
            : ''
          console.log(sExp, start, currOffset, end);
*/


      const sendCode = keymap.of([{
        key: "Mod-e",
        preventDefault: true,
        run: ()=>{
          const cm = this.view.state
          let currOffset = cm.selection.main.head
          if (currOffset === 0) return 
          const currText = cm.doc.toString()
          if (currText[currOffset - 1] === '(') currOffset ++  
          const beforeCursor = currText.slice(0,currOffset)
          const afterCursor = currText.slice(currOffset)
          let end = afterCursor.search(/^\([a-zA-Z]/gm)
          if (end === -1) end = currText.length
          end += beforeCursor.length
          end = currText.slice(0,end).lastIndexOf(currText.slice(0,end).match(/\)/gm).pop()) + 1
          let start = currOffset > 0 ?
          beforeCursor.lastIndexOf(beforeCursor.match(/^\([a-zA-Z]/gm).pop())
          :0
          const cursorPosIsValid = start < currOffset && currOffset < end
          const sExp = currText.slice(start, end)
          const sExpIsValid = sExp.match(/\)/gm).length === sExp.match(/\(/gm).length   
          if (cursorPosIsValid && sExpIsValid) WSsend(sExp)

        }
      }])
    
      const initialState = EditorState.create({
        doc: this.code,
        extensions: [
          basicSetup,
          schemeLang,
          sendCode,
          onChange,
          schemeLang.data.of({
          autocomplete: snippets
          }),
          oneDark,
          ]
      })


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
      parinfer(){
      // parinferLayer(key, this.view.state, this.view)
      }
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