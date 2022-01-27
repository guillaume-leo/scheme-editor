<template>
  <div data-tauri-drag-region class="titlebar">
      <div v-if="hasChanged">
        <p id='dot'>●</p>
      </div>
      <div>
          <p id="path">{{this.filePath}}</p>
      </div>

      <div class="node">
          {{this.node}}
      </div>

      <div class="titlebar-button" id="titlebar-opacity">
        <Icon @click="changeOpacity" width="30" :icon="icons.opacityIcon" />
      </div>
      <div class="titlebar-button" id="titlebar-minimize">
        <Icon @click="minimize" width="30" :icon="icons.windowMinimize" />
      </div>
      <div class="titlebar-button" id="titlebar-maximize">
        <Icon @click="maximize" width="23" :icon="icons.windowMaximize" />
      </div>
      <div class="titlebar-button" id="titlebar-close">
        <Icon @click="close" width="25" :icon="icons.bxWindowClose" />
      </div>
    </div>
</template>

<script>
import { appWindow } from '@tauri-apps/api/window'

import { Icon } from '@iconify/vue'
import windowMaximize from '@iconify-icons/uim/window-maximize'
import bxWindowClose from '@iconify-icons/bx/bx-window-close'
import windowMinimize from '@iconify-icons/la/window-minimize'
import opacityIcon from '@iconify-icons/carbon/opacity';

import _ from 'lodash'


export default {
  components: {
    Icon,
  },
  name: 'TitleBar',
  data() {
    return {
		icons: {
            windowMaximize,
            bxWindowClose,
            windowMinimize,     
            opacityIcon                 
		},
    opacity : 1.0,
    filePath: '',
    node: '',
    hasChanged: false,
    fileContent: {},
    editors:[]
	}
  },
    methods: {
      changeOpacity(){
        this.opacity -= 0.2
        if (this.opacity < 0) this.opacity = 1  
        document.getElementsByClassName('container')[0].style.background = `rgba(0.0,0.0,0.0,${this.opacity})`  
        },
      minimize(){
        appWindow.minimize()
      },
      maximize(){
        appWindow.toggleMaximize()
      },
      async close(){ 
        const result = await confirm("Do you really want to leave?")
        if (result) appWindow.close()
      } 
  },
  computed:{
      getFilePath(){
        return this.$store.getters['fs/GET_FILE_PATH']
      },
      getFileHasChanged(){
        return this.$store.getters['fs/GET_HAS_CHANGED']
      },
      getFileContent(){
        return this.$store.getters['fs/GET_FILE_CONTENT']
      },
      getEditors(){
        return this.$store.getters['editors/getEditors']
      },
      getNode(){
        return this.$store.getters['file/getNode']
      },              
  },
  watch: {
      getFileHasChanged(newVal){
        this.hasChanged = newVal
      },
      getFileContent(newVal){
        this.fileContent = newVal             
      },
      getEditors:{
        handler(newVal){
          const editors = []
          newVal.forEach(e => {
            editors.push({
              name:e.name,
              code:e.code
            })
          });
          const areEquals = _.isEqual(editors, this.fileContent)
          this.$store.commit('file/hasChanged',areEquals)
        },
        deep:true
      },

      getFilePath(newVal){
          this.filePath = newVal
      },
      getNode(newVal){
          this.node = newVal
      },
    }
}
</script>

<style scoped>
.titlebar {
  border: solid;
  border-width: 0.5px;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(0.0,0.0,0.0,0.5);
  user-select: none;
  display: flex;
  justify-content: flex-end;
  grid-area: e;
}

.titlebar-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  opacity: 0.7;
  /* background-color: rgba(250,250,250,0.5); */
  animation: blinkOff 0.25s ;
}
.titlebar-button:hover {
  animation: blinkOn 0.25s ;
  /* animation-iteration-count: infinite; */
  background-color: rgba(250,250,250,0.5)
}

#path{
  position: absolute;
  left: 15px;
  opacity: 0.7;
  max-width: 80%;
  justify-content:flex-start;

  font-size: 10px;
  user-select: none;
  pointer-events: none;

}

.node{
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  margin-right: 5px;
}

#dot{
  position: absolute;
  left: 5px;
  top: 0px;
  opacity: 0.7;
  max-width: 80%;
  justify-content:flex-start;

  font-size: 10px;
  user-select: none;
  pointer-events: none;
  animation-name: blink;
  animation-duration: 0.5s;
  animation-iteration-count: infinite;
}

@keyframes blinkOn {
  from {background-color: rgba(250,250,250,0.0);}
  to {background-color: rgba(250,250,250,0.5)}
}
@keyframes blinkOff {
  from {background-color: rgba(250,250,250,0.5)}
  to {background-color: rgba(250,250,250,0.0);}
}

@keyframes blink {
  0%  {opacity: 0.0;}
  50% {opacity: 1.0;}
  100% {opacity: 0.0;}
}
</style>