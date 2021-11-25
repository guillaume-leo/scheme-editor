<script setup lang='ts'>

import TitleBar from '@/components/TitleBar.vue'
import Console from '@/components/Console.vue'

import { ALL_SHORTCUTS } from '@/config/shortcuts'
import { WSconnect } from '@/config/osc'
import Command from '@/components/command/Command.vue'
import Editor from '@/components/editor/Editor.vue'
import { computed } from '@vue/reactivity'

import { editorGetters } from '@/store/editor/getters'
import { useStore } from 'vuex'


const store=useStore()
const editors= computed(()=>store.getters[editorGetters.GET_EDITORS])


WSconnect()

ALL_SHORTCUTS()





</script>

<template>

  <div class="container">
    <div class="d">
      <TitleBar/>
    </div>
    <div class="a">
      <Editor v-for="editor in editors" 
        :key="editor" 
        :name="editor.name"
        :code="editor.code">
      </Editor>
    </div>
    <div class="b">
      <Console/>
    </div>
    <div class="c">
      <Command/>
    </div>

  </div>
</template>

<style scoped>



.container{



   /* COLOR OF THE APP */
  background-color: rgba(0.0,0.0,0.0,1.0);
  /* ------------------------ */
  color: aliceblue;
  height: 100%;
  width: 100%;
  margin:0;
  padding: 0;
  display: grid;
  grid-template-areas: 
            "d d d"
            "a a b"
            "a a b"
            "a a c";
  grid-template-rows: 38px 1fr 0.05fr 0.1fr;
  grid-template-columns: 1fr 1fr 0.4fr;
}


.a, .b, .c, .d{
  padding: 1px;
  margin: 1px;
  border: solid;
  border-width: 0.5px;
  border-color: rgba(255, 255, 255, 0.4);
  background-color: rgba(0.0,0.0,0.0,0.0);
}

.a{
  padding: 1px;
  margin: 1px;
  overflow: auto;
  grid-area: a;
  max-width: 100%;
  grid-auto-flow: row;
  grid-gap:5px;
  /* justify-content: center; */

}

    p{
        margin: 0;
        text-align: end;
    }

.b{
  grid-area: b;
  padding: 1px;
  margin: 1px;
  overflow: auto;
}

.c{
  grid-area: c;
}

.d{
  grid-area: d;
}


</style>



