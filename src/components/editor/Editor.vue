<script setup lang="ts">

import {EditorState, basicSetup} from "@codemirror/basic-setup"
import { Compartment, StateEffect} from "@codemirror/state"
import { oneDark } from '@/config/cm-theme'
import {StreamLanguage} from "@codemirror/stream-parser"
import { scheme } from "@codemirror/legacy-modes/mode/scheme"
import {snippetCompletion as snip} from "@codemirror/autocomplete"

import { keyMaps } from './functions/keyMap'
import { onChange } from './functions/onChangeUpdate'
import { EditorView, keymap } from "@codemirror/view"
import store from "@/store"
import { editorMutations } from "@/store/editor/mutations"
import { menuActions } from "../command/functions/menuActions"
import { computed, onMounted, watch } from "vue"
import { editorGetters } from "@/store/editor/getters"
import { WSsend } from "@/config/osc"
import { blink } from "./functions/evalBlink"


const props = defineProps({
  name: String,
  code: String
})

const editorId:string = `__${props.name}__`


const schemeLang = StreamLanguage.define(scheme) 
const customSnippets = new Compartment
const customHotKeys = new Compartment


const initialState = EditorState.create({
  doc: props.code,
  extensions: [
    basicSetup,
    customSnippets.of(schemeLang.data.of({
      autocomplete: []
    })),
    customHotKeys.of(keymap.of([])),
    schemeLang,
    oneDark,
    ]
})



onMounted(() => {
const editorElement:any= document.getElementById(editorId)
const view = new EditorView({
        parent: editorElement,
        state: initialState,
      })

view.dispatch({
  effects: StateEffect.appendConfig.of([
    keyMaps(view),
    onChange(view, props.name!)
  ])
})

store.commit(editorMutations.ADD_REFERENCE, {
  ref: view,
  name:props.name
})



menuActions.parseSnippetsAction()

const allSnippets = computed(()=>store.getters[editorGetters.GET_SNIPPETS])

watch(()=>[...allSnippets.value], (newVal)=>{
        let newSnippets:any[] = []
        newVal.forEach(e => {
          newSnippets.push(
            snip(e.code, {label: e.label})
          )
        })
        view.dispatch({
          effects: customSnippets.reconfigure(schemeLang.data.of({
              autocomplete: newSnippets
          }))
        })
})

const allHotkeys = computed(()=>store.getters[editorGetters.GET_HOTKEYS])

watch(()=>[...allHotkeys.value], (newVal)=>{
       if (newVal.length < 1) return
        let newHotKeys:any[] = []
        newVal.forEach(e => {
          newHotKeys.push({
            key: e.hotkey,
            preventDefault: true,
            run: ()=>{
              WSsend(e.code)
              blink(view, e.start,e.end)
            }
          })
        })
        view.dispatch({
          effects: customHotKeys.reconfigure(keymap.of(newHotKeys))
        })
})

})




</script>

<template>
  <p>{{props.name}}</p>
<div  v-bind="{ id: editorId }" class="editor">
</div>
</template>



<style scoped>

p{
  
  background-color: rgba(255,255,255,0.15);
  padding: 0;
  margin: 0;
  font-family: monospace;
  color: dimgray;
}

</style>