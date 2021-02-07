import { createStore } from 'vuex'

// data interfaces
export interface UserProps {
  isLogin: boolean;
  id?: number;
  name?: string;
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
    user: { isLogin: false },
    position: []
  },
  mutations: {
    updatePosition (state, payload: string[]) {
      state.position = payload
    },
    loginUser (state, payload: UserProps) {
      state.user = payload
      // save to localStorage
    },
    logoutUser (state) {
      state.user = { isLogin: false }
      // clear localStorage
    }
  },
  getters: {
  },
  actions: {
  },
  modules: {
  }
})
