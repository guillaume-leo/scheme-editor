import Vuex, { StoreOptions } from 'vuex'
import { RootState } from './types'
import { console } from '@/store/console/index'


const store: StoreOptions<RootState> = {
  state:{
    version:'9.1.1'
  },
  modules:{
    console
  }
}

export default new Vuex.Store<RootState>(store) 



// import { createStore } from 'vuex'
// import { editors } from '@/store/editors'
// import { console } from '@/store/console'
// import { info } from '@/store/info'
// import { file } from '@/store/file'

// export default createStore({
//   modules:{
//     editors: editors,
//     console: console,
//     info: info,
//     file: file
//   }
// })
