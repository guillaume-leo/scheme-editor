import { createStore } from 'vuex'
import { editors } from '@/store/editors'
import { console } from '@/store/console'

export default createStore({
  modules:{
    editors: editors,
    console: console
  }
})
