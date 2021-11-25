<script setup lang='ts'>

import { computed } from '@vue/reactivity'
import store from '@/store'
import { consoleGetters } from '@/store/console/getters'

const datas = computed(()=>store.getters[consoleGetters.GET_DATA])


</script>

<template>

  <p v-for="data in datas" :key="data"> 
      • <br>
      {{data.lineNumber}} • <br>
      {{data.text}} 
      <br>
  </p>

</template>

<style scoped>

p{
    padding: 0;
    margin: 0;
    text-align: left;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.7);
}
</style>