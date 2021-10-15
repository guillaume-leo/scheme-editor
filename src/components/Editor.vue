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

      const addBlink = StateEffect.define()

      const blinkField = StateField.define({
        create() {
          return Decoration.none
        },
        update(blinks, tr) {
          blinks = blinks.map(tr.changes)
          for (let e of tr.effects) if (e.is(addBlink)) {
            blinks = blinks.update({
              add: [blinkMark.range(e.value.from, e.value.to)]
            })
          }
          return blinks
        },
        provide: f => EditorView.decorations.from(f)
      })

      const blinkMark = Decoration.mark({class: "cm-blink"})

      const underlineTheme = EditorView.baseTheme({
        ".cm-blink": {  animationName: 'blink',
                        animationDuration: '1s',
                        borderRadius:'2.5px',
                      }
      })


      const blink = (view, start, end) => {
        let effects = [addBlink.of({from:start, to:end})]
          console.log(effects);
        if (!effects.length) return false

        if (!view.state.field(blinkField, false))
          effects.push(StateEffect.appendConfig.of([blinkField,
                                                    underlineTheme]))
        view.dispatch({effects})
        return true
      }


      const keyMaps = keymap.of([{
        key: "Mod-e",
        preventDefault: true,
        run: ()=>{
          let sExp =''
          const cm = this.view.state
          let currOffset = cm.selection.main.head
          if (currOffset === 0) return 
          const currText = cm.doc.toString()
          if (currText[currOffset - 1] === '(') currOffset ++ 
          const beforeCursor = currText.slice(0,currOffset)
          const afterCursor = currText.slice(currOffset)
          // compute the beggining of the s-exp from cursor
          let start = beforeCursor.match(/^\([a-zA-Z]/gm)
          if (start===null) return 
          start = beforeCursor.lastIndexOf(start.pop())
          // compute end of the s-exp from cursor
          let end = afterCursor.match(/^\([a-zA-Z]/gm)
          if (end === null) {
            end = currText.lastIndexOf(currText.match(/\)/gm).pop()) + 1
            sExp = currText.slice(start, end)
            if (start < currOffset && currOffset < end){
              blink(this.view, start, end)
              WSsend(sExp)
            }
            return
          }
          let nextExpIndex = /^\([a-zA-Z]/gm.exec(afterCursor).index + beforeCursor.length
          end = currText.slice(0, nextExpIndex)
          end = end.lastIndexOf(end.match(/\)/gm).pop()) + 1
          sExp = currText.slice(start, end)
          if (start < currOffset && currOffset < end){
            blink(this.view, start, end)
            WSsend(sExp)
          }        

        }
      }])
      
      const initialState = EditorState.create({
        doc: this.code,
        extensions: [
          basicSetup,
          schemeLang,
          keyMaps,
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