<template>

  <div class="container">
    <input type="text" style="display:none" id="elementt">
    <TitleBar/>
    <div class="a">
      <Editor v-for="editor in editors" 
        :key="editor" 
        :name="editor.name"
        :code="editor.code">
      </Editor>

    </div>
    <div class="b">
      <Info/>
    </div>
    <div class="c">
      <Command />
    </div>
    <div class="d">
      <Console /> 
    </div>
  </div>
</template>


<script>
import TitleBar from '@/components/TitleBar.vue'
import Console from '@/components/Console.vue'
import Command from '@/components/Command.vue'
import Editor from '@/components/Editor.vue'
import Info from '@/components/Info.vue'

import { ALL_SHORTCUTS } from '@/config/shortcuts'
import _ from 'lodash'
import { WSconnect } from '@/config/osc'


WSconnect()

ALL_SHORTCUTS()



export default {
  name: 'Home',
  components: {
    TitleBar,
    Console,
    Command,
    Editor,
    Info
  },
  data(){
    return {
      editors:[]
    }
  },
  methods:{
  },
  computed:{
    getEditors(){
      return this.$store.getters['editors/getEditors']
    }
  },
  watch:{
    getEditors(newVal, oldVal){
      if (_.isEqual(newVal, oldVal)) return
      this.editors = newVal
    }
  }
}

</script>



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
            "e e e"
            "a a b"
            "a a c"
            "a a d";
  grid-template-rows: 30px 1fr 0.05fr 1fr;
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
  /* display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-content: stretch; */

  /* display: grid; */
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
  max-height: 100%;
  overflow: scroll;
}


</style>



