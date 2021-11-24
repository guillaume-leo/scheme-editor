<script setup lang='ts'>
import store from '@/store';
import { CommandGetters } from '@/store/command/getters';
import { computed } from 'vue';
import { keyPress } from './functions/doubleAlt'



let infoPanel= computed(()=>store.getters[CommandGetters.GET_DATA])
let word= computed(()=>store.getters[CommandGetters.GET_WORD])



window.onkeyup = (key: KeyboardEvent) => keyPress(key);


</script>



<template>
<div id="---commands">
    <p v-for="data in infoPanel" :key="data[0]"> 
        {{data[0]}} ► {{data[1]}}
        <br>
        <br>
    </p>
    <p>{{word}}</p>

</div>
</template>



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