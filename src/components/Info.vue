<template>
<p 
    v-for="editor in editors" 
    :id="editor.name"
    :key="editor.name"
    :ref="editor.name"
    
    @mousedown="select" 
>
        {{editor.name}}
</p>
</template>

<script>
export default {
    name:'Info',
    data(){
        return{
            editors:[],
            focused:''
        }
    },
    computed:{
        getEditors(){
            return this.$store.getters['editors/getEditors']
        },
        getFocusedEditor(){
            return this.$store.getters['info/getFocusedEditor']
        }
    },
    methods:{
        select(e){
            const editorId = `__${e.srcElement.innerText}__`
            const buttonId = e.srcElement.innerText
            let editor = document.getElementById(editorId).style
            let button = document.getElementById(buttonId).style
            if (e.ctrlKey) {
                editor.display = 'block'
                button.color = 'rgba(255, 255, 255, 0.8)'
                return
            }
            button.color = 'rgba(255, 255, 255, 0.4)'
            editor.display = 'none'

        }
    },
    watch:{
        getEditors(newVal){
            this.editors = newVal
        },
        getFocusedEditor(newVal){

            const allP = this.editors.map(item =>  item["name"])
            allP.forEach(el => {
                this.$refs[el].classList.remove('focused')
            })
            this.$refs[newVal].classList.add('focused')

        }
    }
}
</script>

<style scoped>
p{  
    background-color: rgba(0.0, 0.0, 0.0, 0.0);
    border:none 1px;
    border-color: rgba(255, 255, 255, 0.5);
    padding: 0;
    margin: 2px;
    text-align: left;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.8);
    font-family: 'Fira Code';
    cursor: crosshair;
}

p:hover{
        background-color: rgba(255, 255, 255, 0.5);
        color:black;
}

.focused{
    border: solid 1px;
}
</style>