<script setup lang="ts">
import store from '@/store'
import { consoleGetters } from '@/store/console/getters'
import { consoleMutations } from '@/store/console/mutations'
import { computed } from '@vue/reactivity'


const messs = computed(()=>store.getters[consoleGetters.GET_DATA])

setTimeout(()=>{
  store.commit(consoleMutations.PRINT, 'JE M4APPELLLE GUILLUAME')
}, 5000)


</script>



<template>
    <p>{{messs}}</p>
</template>

