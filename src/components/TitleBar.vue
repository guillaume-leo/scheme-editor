<template>
  <div data-tauri-drag-region class="titlebar">
      <div class="titlebar-button">
        <button @click="changeTheme">T</button>
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
//icons
import { Icon } from '@iconify/vue'
import windowMaximize from '@iconify-icons/uim/window-maximize'
import bxWindowClose from '@iconify-icons/bx/bx-window-close'
import windowMinimize from '@iconify-icons/la/window-minimize'
import opacityIcon from '@iconify-icons/carbon/opacity';


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
	}
  },
    methods: {
      changeTheme(){
        this.$store.commit('editors/changeTheme')
      },
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

@keyframes blinkOn {
  from {background-color: rgba(250,250,250,0.0);}
  to {background-color: rgba(250,250,250,0.5)}
}
@keyframes blinkOff {
  from {background-color: rgba(250,250,250,0.5)}
  to {background-color: rgba(250,250,250,0.0);}
}
</style>