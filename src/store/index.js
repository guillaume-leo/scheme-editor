import { createStore } from 'vuex'
import { editors } from '@/store/editors'
import { console } from '@/store/console'
import { info } from '@/store/info'
import { file } from '@/store/file'

export default createStore({
  modules:{
    editors: editors,
    console: console,
    info: info,
    file: file
  }
})
