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
  breadcrumb: string[];
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
    updateBreadcrumb (state, payload: string[]) {
      state.position.breadcrumb = payload
    }
  },
  getters: {
  },
  actions: {
  },
  modules: {
  }
})
