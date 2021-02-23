<template>
  <div class="UserDrawer">
    this is UserDrawer
    <q-btn label="退出登录" @click="logout"/>
    <q-btn label="verifyToken" @click="reloadToken"/>
    <q-btn label="log store" @click="logStore"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'UserDrawer',
  components: {
  },
  props: {
  },
  setup () {
    const $store = useStore<StateInterface>()
    const $router = useRouter()
    const logout = () => {
      $store.commit('user/deleteToken')
      void $router.push('/')
    }

    const reloadToken = () => {
      void $store.dispatch('user/reloadToken')
    }

    const logStore = () => {
      console.log($store.state.user.isLogin)
    }
    return {
      logout,
      reloadToken,
      logStore
    }
  }
})
</script>

<style lang="scss" scoped>
.UserDrawer {
}
</style>
