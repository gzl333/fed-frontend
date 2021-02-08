import { createStore } from 'vuex'

// data interfaces
export interface UserProps {
  isLogin: boolean;
  id?: number;
  name: string;
  role?: 'user'|'manager'|'provider'|'vo';
}

export type PositionProps = string[]

export interface GlobalDataProps {
  token: string;
  user: UserProps;
  position: PositionProps;
}

// main store
export default createStore<GlobalDataProps>({
  state: {
    token: localStorage.getItem('token') || '',
    user: { isLogin: false, name: 'default' },
    position: []
  },
  mutations: {
    updatePosition (state, payload: string[]) {
      state.position = payload
    },
    loadLoggedUser (state) {
      if (state.token === 'testAdmin') {
        state.user = { isLogin: true, name: state.token }
      }
    },
    loginUser (state, payload: UserProps) {
      state.user = payload
      state.token = state.user.name
      localStorage.setItem('token', state.user.name)
    },
    logoutUser (state) {
      state.user = { isLogin: false, name: 'default' }
      state.token = ''
      localStorage.clear()
    }
  },
  getters: {
  },
  actions: {
  },
  modules: {
  }
})
