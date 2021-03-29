<template>
  <q-layout view="hHh lpR fFf">
    <!--    <q-header elevated class="bg-nord0 text-white q-pa-xs">-->
    <!--      <q-toolbar>-->
    <!--        <q-toolbar-title>-->
    <!--          <q-btn :ripple="false" to="/my" dense>-->
    <!--            <img src="logo.png" class="logo"/>-->
    <!--          </q-btn>-->
    <!--        </q-toolbar-title>-->

    <!--        <q-space/>-->
    <!--        <div class="q-gutter-md row items-center no-wrap">-->

    <!--          <q-btn disable :ripple="false" round flat color="grey-5" icon="library_books" v-if="$q.screen.gt.sm"-->
    <!--                 @click="toggleRightDrawer">-->
    <!--            <q-tooltip>使用手册</q-tooltip>-->
    <!--          </q-btn>-->
    <!--          <q-btn disable :ripple="false" round flat color="grey-5" icon="notifications">-->
    <!--            <q-badge color="nord11" text-color="white" floating>-->
    <!--              0-->
    <!--            </q-badge>-->
    <!--            <q-tooltip>系统消息</q-tooltip>-->
    <!--          </q-btn>-->

    <!--          <q-btn-dropdown :ripple="false" rounded flat class="q-pa-sm" :label="currentUser.cstEmail">-->
    <!--            &lt;!&ndash;            <template v-slot:label>&ndash;&gt;-->
    <!--            &lt;!&ndash;              <q-avatar size="26px">&ndash;&gt;-->
    <!--            &lt;!&ndash;                <img src="https://cdn.quasar.dev/img/boy-avatar.png">&ndash;&gt;-->
    <!--            &lt;!&ndash;              </q-avatar>&ndash;&gt;-->
    <!--            &lt;!&ndash;              {{ currentUser }}&ndash;&gt;-->
    <!--            &lt;!&ndash;            </template>&ndash;&gt;-->

    <!--            <div class="row justify-center no-wrap q-pa-md dropdown-content non-selectable">-->
    <!--              <div class="column items-center">-->
    <!--                <q-avatar size="72px" class="q-mt-lg">-->
    <!--                  <img src="img/default-avatar.png">-->
    <!--                </q-avatar>-->
    <!--                <div class="text-subtitle1 q-ma-none q-mt-md text-nord6">{{ currentUser.cstTrueName }}</div>-->
    <!--                <div class="text-subtitle1 q-ma-none q-mb-md text-nord6">{{ currentUser.cstEmail }}</div>-->
    <!--              </div>-->
    <!--            </div>-->

    <!--            <q-list class="dropdown-items non-selectable">-->
    <!--              <q-item clickable disable>-->
    <!--                <q-item-section>账户设置</q-item-section>-->
    <!--              </q-item>-->
    <!--              <q-item clickable tag="a" href="https://passport.escience.cn/user/password.do?act=showChangePassword"-->
    <!--                      target="_blank">-->
    <!--                <q-item-section>修改密码</q-item-section>-->
    <!--              </q-item>-->
    <!--              <q-item clickable @click="toLogout" class="bg-nord6">-->
    <!--                <q-item-section>退出登录</q-item-section>-->
    <!--              </q-item>-->
    <!--            </q-list>-->
    <!--          </q-btn-dropdown>-->
    <!--        </div>-->
    <!--      </q-toolbar>-->
    <!--    </q-header>-->

    <global-leftdrawer/>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered :width="300">
      <global-rightdrawer/>
    </q-drawer>

    <q-page-container>
      <q-page class="row no-wrap">
        <div class="col ">
          <div class="column full-height">

            <q-scroll-area class="col " visible>
              <router-view class="routerview-area"/>
            </q-scroll-area>

          </div>
        </div>
      </q-page>

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
    const currentUser = $store.state.user

    const rightDrawerOpen = ref(false)
    const toggleRightDrawer = () => {
      rightDrawerOpen.value = !rightDrawerOpen.value
    }
    const toLogout = () => {
      void $store.dispatch('user/logoutCstUser')
    }
    const log = async () => {
      const result = await $store.dispatch('user/fetchCstNewToken', $store.state.user.token!.refresh)
      console.log(result)
    }
    return {
      rightDrawerOpen,
      toggleRightDrawer,
      currentUser,
      toLogout,
      log
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
  background-size: 150% auto;
}

.dropdown-items {
  text-align: center;
}
</style>
