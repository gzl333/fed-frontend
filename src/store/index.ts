import { createStore } from 'vuex'

import { testPosition } from '@/store/testData.ts'

// data interfaces
export interface UserProps {
  isLogin: boolean;
  id: number;
  name?: string;
  role?: 'user'|'manager'|'provider'|'vo';
}

export type PositionProps = string[]

export interface GlobalDataProps {
  user: UserProps;
  position: PositionProps;
}

// default user not logged
const defaultUser: UserProps = {
  isLogin: false,
  id: 0
}

// main store
export default createStore<GlobalDataProps>({
  state: {
    user: defaultUser,
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
      state.user = defaultUser
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
