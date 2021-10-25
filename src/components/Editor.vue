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
import {StateField, StateEffect, Compartment} from "@codemirror/state"
import { schemeLang } from '@/config/editors'
import { oneDark } from '@/config/cm-theme'
import {snippetCompletion as snip} from "@codemirror/autocomplete"
import {keymap} from "@codemirror/view"

import { WSsend } from '@/config/osc'
import { menuActions } from '@/functions/menuActions'
// import store from '@/store' // eslint-disable-line

// import _ from 'lodash'

// import { parseBuffer } from '@/config/parseBuffer'
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
            codeFromVuex:'',
            allSnippets:[]

        }
    },
    mounted(){

      // ONCHANGE commit focusedEditor, updateCode, updateSnippets
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
      const removeBlink = StateEffect.define()

      const blinkField = StateField.define({
        create() {
          return Decoration.none
        },
        update(blinks, tr) {
          blinks = blinks.map(tr.changes)
          for (let e of tr.effects) {
            if (e.is(addBlink)) {
              blinks = blinks.update({
                add: [blinkMark.range(e.value.from, e.value.to)]
              })
            }else if (e.is(removeBlink)) {
              blinks = blinks.update({filter: e.value})}
          }
          return blinks
        },
        provide: f => EditorView.decorations.from(f)
      })

      function removeMarks(view, a, b) {
        view.dispatch({
          effects: removeBlink.of((from, to) => to <= a || from >= b)
        })
      }

      const blinkMark = Decoration.mark(
        {
          class: "cm-blink",
          'id': 'BLINK'
        })

      const blinkTheme = EditorView.baseTheme({
        ".cm-blink": {  animationName: 'blink',
                        animationDuration: '1s',

                        borderRadius:'2.5px',
                      },
      })


      const blink = (view, start, end) => {
        let effects = [addBlink.of({from:start, to:end})]
        if (!effects.length) return false
0
        if (!view.state.field(blinkField, false))

          effects.push(StateEffect.appendConfig.of([blinkField,
                                                    blinkTheme]))


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
              setTimeout(()=>{removeMarks(this.view, start, end)}, 1000)
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
            setTimeout(()=>{removeMarks(this.view, start, end)}, 1000)

            WSsend(sExp)
          }        

        }
      },
      {
        key: "Mod-ArrowDown",
        preventDefault: true,
        run: ()=>{
          const cm = this.view.state
          let currOffset = cm.selection.main.head
          const currText = cm.doc.toString()
          if (currText[currOffset - 1] === '(') currOffset ++ 
          const beforeCursor = currText.slice(0,currOffset)
          const afterCursor = currText.slice(currOffset)
          let nextExp = afterCursor.match(/^\([a-zA-Z]/gm)
          console.log(nextExp);
          if (nextExp === null) return
          const newPos = afterCursor.indexOf(nextExp[0])+beforeCursor.length + 1
          this.view.dispatch({
              selection: {
              anchor: newPos
              }
          })
        }
      },
      {
        key: "Mod-ArrowUp",
        preventDefault: true,
        run: ()=>{
          const cm = this.view.state
          let currOffset = cm.selection.main.head
          const currText = cm.doc.toString()
          if (currText[currOffset - 1] === '(') currOffset ++ 
          const beforeCursor = currText.slice(0,currOffset)
          let prevExp = beforeCursor.match(/^\([a-zA-Z]/gm)
          if (prevExp===null) return 
          prevExp.pop()
          const newPos = beforeCursor.lastIndexOf(prevExp.pop()) + 1
          this.view.dispatch({
              selection: {
              anchor: newPos
              }
          })
        }
      }
      ])


      this.customSnippets = new Compartment
      this.customHotKeys = new Compartment
      const initialState = EditorState.create({
        doc: this.code,
        extensions: [
          basicSetup,
          this.customSnippets.of(schemeLang.data.of({
              autocomplete: []
          })),
          this.customHotKeys.of(keymap.of([])),
          keyMaps,
          onChange,
          schemeLang,
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
      menuActions.parseSnippetsAction()
      blink(this.view, 0, 0)
    },
    methods:{
      parinfer(key){
      parinferLayer(key, this.view.state, this.view)
      },
    },
    computed:{
      getEditors(){
        return this.$store.getters['editors/getEditors']
      },
      getSnippets(){
        return this.$store.getters['editors/getSnippets']
      },
      getHotKeys(){
        return this.$store.getters['editors/getHotKeys']
      }
    },
    watch:{
      getSnippets(newVal){
        let newSnippets = []
        newVal.forEach(e => {
          newSnippets.push(
            snip(e.code, {label: e.label})
          )
        })
        this.view.dispatch({
          effects: this.customSnippets.reconfigure(schemeLang.data.of({
              autocomplete: newSnippets
          }))
        })
      },
      getHotKeys(newVal){
        if (newVal.length < 1) return
        let newHotKeys = []
        newVal.forEach(e => {
          newHotKeys.push({
            key: e.hotkey,
            preventDefault: true,
            run: ()=>{
              WSsend(e.code)
            }
          })
        })
        this.view.dispatch({
          effects: this.customHotKeys.reconfigure(keymap.of(newHotKeys))
        })
      }
    }
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