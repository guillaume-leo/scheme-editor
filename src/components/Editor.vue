<template>
  <p>{{this.name}}</p>
<div  v-bind="{ id: this.editorId }" @keyup="parinfer" class="editor">
</div>
</template>

<script>


// import _ from 'lodash'

//CODEMIRROR 6
import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup"
import {Decoration} from "@codemirror/view"
import {StateField, StateEffect} from "@codemirror/state"
import { schemeLang } from '@/config/editors'
import { oneDark } from '@/config/cm-theme'
import {snippets} from "@/config/snippets"
import {keymap} from "@codemirror/view"

import { WSsend } from '@/config/osc'
// import _ from 'lodash'

// import { parseBuffer } from '@/config/parseBuffer'
// import { parseBufferSnippets } from '@/config/parseBufferSnippets'
import { parinferLayer } from '@/config/editors'


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

      // ONCHANGE commit focusedEditor, updateCode
      const onChange = EditorView.updateListener.of((obj) => {
        if (obj.view.hasFocus) this.$store.commit('info/focusedEditor', this.name)
        const cm = this.view.state
        const currText = cm.doc.toString()
        this.$store.commit('editors/updateCode', {
          name: this.name,
          code: currText
        })
      })




      
      // state-effect and state-field definition
      const addBlink = StateEffect.define()
      const blinkField = StateField.define({
        create() {
          return Decoration.none
        },
        update(blink, tr) {
          blink = blink.map(tr.changes)
          for (let e of tr.effects) if (e.is(addBlink)) {
            blink = blink.update({
              add: [blinkMark.range(e.value.from, e.value.to)]
            })
          }
          return blink
        },
        provide: f => EditorView.decorations.from(f)
      })

      // mark definition
      const blinkMark = Decoration.mark({class: "cm-blink"})

const blinkExpression = () => {
  let effects = this.view.state.selection.ranges
    .filter(r => !r.empty)
    .map(({from, to}) => addBlink.of({from, to}))
  if (!effects.length) return false

  if (!this.view.state.field(blinkField, false))
    effects.push(StateEffect.appendConfig.of([blinkField,
                                              blinkTheme]))
  this.view.dispatch({effects})
  return true
}

      // blinkTheme when mod-e
      const blinkTheme= EditorView.baseTheme({
        ".cm-blink": {  
          backgroundColor:'white',
          animationName: 'blink',
          animationDuration: '1s',
        },
        '@keyframes blink' : {
            from: {backgroundColor: 'aliceblue'},
            to: {backgroundColor: 'black'}
            },    
      })  

      // Mod-e eventHandler
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
          console.log(blinkExpression);
        }
      }])
      
      const initialState = EditorState.create({
        doc: this.code,
        extensions: [
          blinkTheme,
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
      parinfer(key){
      parinferLayer(key, this.view.state, this.view)
      }
    },
    computed:{
      getEditors(){
        return JSON.stringify(this.$store.getters['editors/getEditors'])
      }
    },
}
</script>

<style scoped>

p{
  
  background-color: rgba(255,255,255,0.15);
  padding: 0;
  margin: 0;
  font-family: monospace;
  color: dimgray;
}

</style>