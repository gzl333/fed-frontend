<template>
  <div class="UserDrawer">
    this is UserDrawer
    <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 30vh">
      <div class="bg-transparent absolute-center">
        <q-avatar size="100px" class="q-mb-sm">
          <img src="https://cdn.quasar.dev/img/boy-avatar.png">
        </q-avatar>
        <div class="text-weight-bold">测试用户</div>
        <div>@testusername</div>
      </div>
    </q-img>
    <div class="absolute-center">
      <q-btn label="退出登录" @click="logout" color="nord11"/>
    </div>

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
      console.log($store.state.user.token)
      void $router.push('/')
    }
    return {
      logout
    }
  }
})
</script>

<style lang="scss" scoped>
.UserDrawer {
}
</style>
