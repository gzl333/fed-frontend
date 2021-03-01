<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-nord0 text-white q-pa-xs">
      <q-toolbar>
        <q-toolbar-title>
          <q-btn :ripple="false" to="/my" dense>
            <img src="logo.png" class="logo"/>
          </q-btn>
        </q-toolbar-title>
        <!--        <q-btn label="LOG" @click="logJWT"/>-->

        <!--        <router-link :to="{path: '/'}" class="text-nord7">DEV: goto HOME</router-link>-->
        <q-space/>
        <div class="q-gutter-md row items-center no-wrap">

          <q-btn round flat color="grey-5" icon="library_books" v-if="$q.screen.gt.sm" @click="toggleRightDrawer">
            <q-tooltip>使用手册</q-tooltip>
          </q-btn>
          <q-btn disable round flat color="grey-5" icon="notifications">
            <q-badge color="nord11" text-color="white" floating>
              0
            </q-badge>
            <q-tooltip>系统消息</q-tooltip>
          </q-btn>

          <q-btn-dropdown rounded flat class="q-pa-sm">
            <template v-slot:label>
              <q-avatar size="26px">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
              </q-avatar>
            </template>

            <div class="row justify-center no-wrap q-pa-md dropdown-content non-selectable">
              <div class="column items-center">
                <q-avatar size="72px" class="q-mt-lg">
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                </q-avatar>
                <div class="text-subtitle1 q-mt-md q-mb-md text-nord6">{{ currentUser }}</div>
              </div>
            </div>

            <q-list separator class="dropdown-items bg-nord6 non-selectable">
              <q-item clickable disable>
                <q-item-section>账户设置</q-item-section>
              </q-item>
              <q-item clickable tag="a"  href="https://passport.escience.cn/user/password.do?act=showChangePassword" target="_blank">
                <q-item-section>修改密码</q-item-section>
              </q-item>
              <q-item clickable @click="toLogout" class="bg-nord11 text-nord6">
                <q-item-section>退出登录</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <global-leftdrawer/>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered :width="300">
      <global-rightdrawer/>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from '../store'
import GlobalRightdrawer from 'components/GlobalRightdrawer.vue'
import GlobalLeftdrawer from 'components/GlobalLeftdrawer.vue'

export default defineComponent({
  name: 'MyLayout.vue',
  components: {
    GlobalLeftdrawer,
    GlobalRightdrawer
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const currentUser = $store.state.user.email

    const rightDrawerOpen = ref(false)
    const toggleRightDrawer = () => {
      rightDrawerOpen.value = !rightDrawerOpen.value
    }

    const toLogout = () => {
      $store.commit('user/deleteToken')
    }
    return {

      rightDrawerOpen,
      toggleRightDrawer,

      currentUser,
      toLogout
    }
  }
})
</script>

<style lang="scss" scoped>
.logo {
  height: 50px;
}

.dropdown-content {
  min-width: 200px;
  background-image: url(https://cdn.quasar.dev/img/material.png);
  background-size: 120% auto;
}

.dropdown-items {
  text-align: center;
}
</style>
