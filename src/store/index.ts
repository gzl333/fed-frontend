import { createStore } from 'vuex'

import { testUser, testPosition } from '@/store/testData.ts'

// data interfaces
export interface UserProps {
  isLogin: boolean;
  id: number;
  name?: string;
  role?: 'user'|'manager'|'provider'|'vo';
}

export interface PositionProps {
  breadcrum: string[];
}

export interface GlobalDataProps {
  user: UserProps;
  position: PositionProps;
}

// main store
export default createStore<GlobalDataProps>({
  state: {
    user: testUser,
    position: testPosition
  },
  mutations: {
    updateBreadcrum (state, payload: string[]) {
      state.position.breadcrum = payload
    }
  },
  getters: {
  },
  actions: {
  },
  modules: {
  }
})
