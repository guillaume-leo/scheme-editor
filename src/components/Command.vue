<template>
  <div>
      <input tabindex="-1" id='commandInput' @keyup.enter="execCommand" type="text" name="" v-model="command">
  </div>
</template>

<script>
import { COMMANDS } from '../constants/Commands.js'

export default {
    name: 'Command',
    methods:{
        execCommand(){
            const command = this.command.trim().split(' ')
            const car = command[0]
            const cdr = command.slice(1)
            if (Object.keys(COMMANDS).includes(car)) {
                COMMANDS[car](cdr)
                this.command = ''
                return
            }
            this.$store.commit('console/print',`${car} doesn't exist! Type 'info' to get the full command's list`)
        },
    },
    data() {
        return {
            command: ''
        }
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
</style>