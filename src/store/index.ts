import Vuex, { StoreOptions } from 'vuex'
import { RootState } from './types'
import { console } from '@/store/console/index'
import { command } from '@/store/command/index'
import { editor } from '@/store/editor/index'


const store: StoreOptions<RootState> = {
  state:{
    version:'1.0.1'
  },
  modules:{
    console,
    editor,
    command
  }
}

export default new Vuex.Store<RootState>(store) 
