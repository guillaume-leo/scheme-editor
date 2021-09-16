<template>
            <textarea v-model="content" id="editor" cols="30" rows="10"></textarea>
</template>

<script>

import * as CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/scheme/scheme.js'
import '../config/codemirrorThemes'
import * as parinferCodeMirror from 'parinfer-codemirror'
import { parseBuffer } from '@/config/parseBuffer'
import * as parinfer from 'parinfer'


const result = parinfer.indentMode("(def foo\n [a b\n; c])")
console.log(result)

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
            editorId: this.id
        }
    },
    mounted(){
        const rand = Math.random().toString(16).substr(2, 8);
        const elem = document.getElementById('editor')
        const options = {
            mode: "scheme",
            lineNumbers: true,
            theme: this.theme
        }
        this.cm = CodeMirror.fromTextArea(elem, options)
        this.cm.setSize("99%", '99%')
        const editorId = `${rand}_${this.editorId}` 
        const ref = this.cm
        const htmlNode = this.cm.getWrapperElement()
        htmlNode.id = editorId
        this.$store.commit('editors/addRef', {ref, editorId})
        parinferCodeMirror.init(ref, 'smart', {forceBalance: true})
        ref.on('blur', ()=>{
          this.$store.commit('editors/focused', '')
        })
        ref.on('focus', ()=>{
          this.$store.commit('editors/focused', this.editorId)
          console.log(parseBuffer(ref.getValue()))
        })

        //TO RETHINK
        ref.on('change', (cm, e)=>{
          

          if ((e.origin === '+input' || e.origin === 'paste') && cm.getValue().includes('lambda')){
            // const currentLine = cm.getCursor().line
            // const prevCurrentLine = "a"
            console.log(e);
            const cursorPos = {
              line:cm.getCursor().line,
              ch:cm.getCursor().ch -1
            }            
            let text =  cm.getValue()            
            cm.setValue(text.replaceAll('lambda', 'λ'));
            cm.setCursor(cursorPos) 
          }
 

          
        })
// (salut lambda ())

        ref.focus()
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
        getTheme(newVal){
            this.cm.setOption('theme', newVal)
        }

    },
    unmounted(){
      this.cm.getWrapperElement().parentNode.removeChild(this.cm.getWrapperElement());
      this.cm=null;
    }

        

    

}
</script>

<style scoped>


    textarea{
        display: none;
        font-family: 'Fira Code' !important;
    }

</style>