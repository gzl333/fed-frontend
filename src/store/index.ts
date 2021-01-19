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
  subview: string;
}

export interface GlobalDataProps {
  user: UserProps;
  position: PositionProps;
}

export type Subview = 'vmlist'|'orgtree'|'vmadvsearch'|'vmcreate'

const breadcrumList = {
  vmlist: ['在用资源', '云服务器', '云服务器列表'],
  orgtree: ['在用资源', '云服务器', '机构树'],
  vmadvsearch: ['在用资源', '云服务器', '云服务器高级搜索'],
  vmcreate: ['在用资源', '云服务器', '创建云主机']
}

// main store
export default createStore<GlobalDataProps>({
  state: {
    user: testUser,
    position: testPosition
  },
  mutations: {
    gotoSubview (state, payload: Subview) {
      state.position.subview = payload
      state.position.breadcrum = breadcrumList[payload]
    }
  },
  getters: {
  },
  actions: {
  },
  modules: {
  }
})
