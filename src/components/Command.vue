<template>
<div id="---commands">
    <!-- <input tabindex="-1" id='commandInput' @keyup.enter="execCommand" type="text" name="" v-model="command"> -->
    <p v-for="data in infoPanel" :key="data"> 
        <b>{{data[0]}} ►</b> {{data[1]}} 
        <br>
        <br>
    </p>
    <p>{{word}}</p>

</div>
</template>

<script>
import { COMMANDS } from '../constants/Commands.js'
import _ from 'lodash'


export default {
    name: 'Command',
    methods:{
        async cmdSystem(cmd, type){
            this.infoPanel = cmd.map(e=>[e.key,e.label])
            const answer = await new Promise((resolve) => {
                
                window.onkeydown = (e)=>{
                    if (type === 'key') {
                        resolve(e)
                    }else{
                        if (e.key === 'Enter') {
                            resolve({key:e.key, payload: this.word})
                            }
                        if (e.key.length === 1) this.word += e.key
                        console.log(e.key);
                        if (e.key === 'Backspace') this.word = this.word.slice(0, -1)
                    }
                    
                }
            })
            const nextCommand = _.findIndex(cmd, (e)=>e.key===answer.key)

            if (nextCommand === -1) {
                this.infoPanel = [['⚠error⚠', 'wrong command']]
                return
            }
            if (cmd[nextCommand].action) {
                cmd[nextCommand].action()
                this.infoPanel = [['double Alt','command']]
                this.prevWord = this.word
                this.word = ''
                return
            } 

            return await this.cmdSystem(cmd[nextCommand].children, cmd[nextCommand].type)
        },
        execCommand(){
            const command = this.command.trim().split(' ')
            const car = command[0]
            const cdr = command.slice(1)
            if (Object.keys(COMMANDS).includes(car)) {
                console.log(Object.keys(COMMANDS).indexOf(car));
                COMMANDS[car](cdr)
                this.command = ''
                return
            }
            this.$store.commit('console/print',`${car} doesn't exist! Type 'info' to get the full command's list`)
        },
    },
    data() {
        return {
            command: '',
            infoPanel:[['double Alt','command']],
            keyPressed:'',
            word: '',
            prevWord:'',
            cmd:
            [
                {
                    key: 'f',
                    label: 'file commands',
                    children:[
                        {
                            key: 'n',
                            label: 'new file',
                            children:[]
                        },
                        {
                            key: 's',
                            label: 'save',
                            children:[],
                            action:()=>{console.log('saved!!!')}
                        },
                        {
                            key: 'a',
                            label: 'saveAs',
                            children:[
                                {
                                    key: 'Enter',
                                    label: 'Write name and press Enter',
                                    children:[
                                        {
                                            key: 'o',
                                            label: `overwrite ${this.prevWord}.json`,
                                            action:()=>{ console.log('OK') }

                                        }
                                    ],
                                    type: 'key',
                                    action:()=>{console.log('saved!!!' + this.word)},
                                }
                            ],
                            type: 'word',
                        },
                        {
                            key: 'l',
                            label: 'load',
                            children:[]
                        },
                    ],
                    type: 'key'
                },
                {
                    key: 'e',
                    label: 'editor commands',
                    children:[]                
                },
                {
                    key: 't',
                    label: 'tree commands',
                    children:[]                
                },
                {
                    key: 'o',
                    label: 'options',
                    children:[]                
                }
            ]
        }
    },
    mounted(){

        let pressed;
        let lastPressed;
        let isDoublePress;

        const handleDoublePresss = (key) => {
            if (key.key === 'Alt') this.cmdSystem(this.cmd, 'key')
        }

        const timeOut = () => setTimeout(() => isDoublePress = false, 250);

        const keyPress = key => {
            pressed = key.keyCode;

            if (isDoublePress && pressed === lastPressed) {
                isDoublePress = false;
                handleDoublePresss(key);
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
        font-size: 8px;
        color: rgba(255, 255, 255, 0.7);
    }
</style>