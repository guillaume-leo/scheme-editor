<template>

  <p v-for="data in getAllData" :key="data"> 
      - - - - - <br>
      {{data.lineNumber}} > <br>
      {{data.text}} 
      <br>
  </p>
</template>

<script>

export default {
    name: 'Console',
    computed:{
      getAllData(){
        return this.$store.getters.getConsoleData
      }
    }
}
</script>

<style scoped>

p{
    padding: 0;
    margin: 0;
    text-align: left;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
}
</style>