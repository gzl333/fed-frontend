import { MutationTree } from 'vuex'
import { ApiJwtInterface, UserInterface } from './state'
import axios from 'axios'

const mutation: MutationTree<UserInterface> = {
  storeToken (/* this: rightType, */context:UserInterface, payload:ApiJwtInterface) {
    // 注意此时context是store.state.user，而不是store.state
    // vuex
    context.isLogin = true
    context.token = payload
    // localStorage
    localStorage.setItem('tokenAccess', context.token.access)
    localStorage.setItem('tokenRefresh', context.token.refresh)
    // axios header
    axios.defaults.headers.common.Authorization = `Bearer ${context.token.access}`

    // redirect should be added here!!!
    // console.log('this', this)
    // a correct annotation to this value may solve the problem. but currently not sure about the right type of this...
    // @ts-ignore something wrong with types of Quasar's this.$router in actions.ts and mutations.ts. see:https://forum.quasar-framework.org/topic/6310/typescript-error-when-using-this-router-in-actions-ts
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.$router.push('/my')
  },
  deleteToken (context: UserInterface) {
    // vuex
    context.isLogin = false
    delete context.token
    // localStorage
    localStorage.removeItem('tokenAccess')
    localStorage.removeItem('tokenRefresh')
    // axios header
    delete axios.defaults.headers.common.Authorization
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.$router.push('/')
  }
}

export default mutation
