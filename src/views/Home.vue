<template>

  <div class="container">
    <TitleBar/>
    <div class="a">
    </div>
    <div class="b">
    </div>
    <div class="c">
      <Command />
    </div>
    <div class="d">
      <Console /> 
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
  padding: 0;
  margin: 0;
  border: solid;
  border-width: 0.5px;
  border-color: rgba(255, 255, 255, 0.4);
  background-color: rgba(0.0,0.0,0.0,0.0);
}

.a{
  grid-area: a;
}

.b{
  grid-area: b;
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


<script>
import TitleBar from '@/components/TitleBar.vue'
import Console from '@/components/Console.vue'
import Command from '../components/Command.vue'
export default {
  name: 'Home',
  components: {
    TitleBar,
    Console,
    Command
  },
  methods:{
    myfunc(){
      console.log("hyahaaa");
    }
  } 
}

</script>
