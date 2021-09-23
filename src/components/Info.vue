<template>
<p 
    v-for="name in editors" 
    :id="name"
    :key="name"
    :ref="name"
    
    @mousedown="select"
>
        {{name}}
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
        getNames(){
          return this.$store.getters['editors/getNames']
        },
        getFocusedEditor(){
            return this.$store.getters['info/getFocusedEditor']
        }
    },
    methods:{
        select(e){
            e.ctrlKey ?
            console.log(`SHOW/HIDE ${e.srcElement.innerText}`)
            :console.log(`SELECT ${e.srcElement.innerText}`)
        }
    },
    watch:{
        getNames(newVal){
          this.editors = newVal
        },
        getFocusedEditor(newVal){
            const allP = Object.keys(this.$refs);
            allP.forEach(el => {
                this.$refs[el].classList.remove('focused')
                // el.style.border = 'none'
            });
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
    color: rgba(255, 255, 255, 0.7);
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