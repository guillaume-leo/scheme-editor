<template>
<div id="---commands">
    <!-- <input tabindex="-1" id='commandInput' @keyup.enter="execCommand" type="text" name="" v-model="command"> -->
    <p v-for="data in infoPanel" :key="data"> 
        {{data[0]}} ► {{data[1]}} 
        <br>
        <br>
    </p>
    <p>{{word}}</p>

</div>
</template>

<script>
import _ from 'lodash'
import { menu } from '@/config/menu'
export default {
    name: 'Command',
    methods:{
        async cmdSystem(cmd, type){
            this.infoPanel = await cmd.map(e=>[e.key,e.label])
            const answer = await new Promise((resolve) => {
                
                window.onkeydown = (e)=>{
                    if (this.infoPanel[0][0] ==='double Alt') return
                    if (type === 'key') {
                        resolve(e)
                    }else{
                        if (e.key === 'Enter') {
                            resolve({key:e.key, payload: this.word})
                            }
                        if (e.key.length === 1) this.word += e.key
                        if (e.key === 'Backspace') this.word = this.word.slice(0, -1)
                    }
                    
                }
            })
            const nextCommand = _.findIndex(cmd, (e)=>e.key===answer.key)

            if (nextCommand === -1) {
                setTimeout(() => {
                    this.storedRef.contentDOM?.focus()
                }, 150);
                this.infoPanel = [['⚠error⚠', 'wrong command']]
                return
            }
            if (cmd[nextCommand].action) {
                this.prevWord = this.word
                const action = cmd[nextCommand].action(this.prevWord)
                if (typeof action === 'object') return await this.cmdSystem(action, cmd[nextCommand].type)
                this.infoPanel = [['double Alt','menu']]
                this.word = ''
                setTimeout(() => {
                    this.storedRef.contentDOM?.focus()
                }, 150);
                return
            } 

            return await this.cmdSystem(cmd[nextCommand].children, cmd[nextCommand].type)
        },

    },
    data() {
        return {
            command: '',
            infoPanel:[['double Alt','menu']],
            keyPressed:'',
            word: '',
            prevWord:'',
            cmd:menu,
            focusedEditor:'',
            storedRef:{},
            
        }
    },
    computed:{
        getFocusedEditor(){
            const name = this.$store.getters['info/getFocusedEditor'] 
            const editors = this.$store.getters['editors/getEditors']
            return editors.find(e=>e.name===name)?.ref
        }
    },
    watch:{
        getFocusedEditor(newVal){
            this.focusedEditor = newVal        
        }
    },
    mounted(){

        let pressed;
        let lastPressed;
        let isDoublePress;

        const handleDoublePressAlt = (key) => {

            if (key.key === 'Alt') {
                this.cmdSystem(this.cmd(), 'key')
                if (this.focusedEditor) this.storedRef = this.focusedEditor
                this.storedRef.contentDOM?.blur()
                

            }
        }

        const timeOut = () => setTimeout(() => isDoublePress = false, 250);

        const keyPress = key => {
            pressed = key.keyCode;

            if (isDoublePress && pressed === lastPressed) {
                isDoublePress = false;
                handleDoublePressAlt(key);
            } else {
                isDoublePress = true;
                timeOut();
            }

            lastPressed = pressed;
        }

        window.onkeyup = key => keyPress(key)

    }
}
</script>

<style scoped>
    input{
        background-color: rgba(0.0,0.0,0.0,0.0);
        border: none;
        border-color: rgba(0.0,0.0,0.0,0.0);
        width: 100%;
        height: 100%;
        color: grey;
        
    }

    input:focus {
        border: none;
        outline: none;
        text-decoration: none !important;

    }


    ::selection {
        color: white;
        background: grey;
    }

    p{
        padding: 5px;
        margin: auto;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
    }
</style>