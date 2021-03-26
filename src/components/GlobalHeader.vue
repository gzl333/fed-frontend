<template>
  <div class="GlobalHeader">
    <div class="row">
      <q-toolbar>
        <q-toolbar-title>
<!--          <q-btn :ripple="false" flat to="/my" dense>-->
            <dvi class="text-h5">中国科技云联邦</dvi>
<!--          </q-btn>-->
        </q-toolbar-title>

        <q-space/>
        <div class="q-gutter-md row items-center no-wrap">

<!--          <q-btn  :ripple="false" round flat color="grey-5" icon="library_books" v-if="$q.screen.gt.sm"-->
<!--                 @click="toggleRightDrawer">-->
<!--            <q-tooltip>使用手册</q-tooltip>-->
<!--          </q-btn>-->

          <q-btn disable :ripple="false" round flat color="grey-5" icon="notifications">
            <q-badge color="c-blue-3" text-color="white" floating>
              0
            </q-badge>
            <q-tooltip>系统消息</q-tooltip>
          </q-btn>

          <q-btn-dropdown :ripple="false"  flat class="q-pa-sm" :label="currentUser.cstEmail">

            <div class="row justify-center no-wrap q-pa-md dropdown-content non-selectable">
              <div class="column items-center">
                <q-avatar size="72px" class="q-mt-lg">
                  <img src="img/default-avatar.png">
                </q-avatar>
                <div class="text-subtitle1 q-ma-none q-mt-md text-nord6">{{ currentUser.cstTrueName }}</div>
                <div class="text-subtitle1 q-ma-none q-mb-md text-nord6">{{ currentUser.cstEmail }}</div>
              </div>
            </div>

            <q-list class="dropdown-items non-selectable">
              <q-item clickable disable>
                <q-item-section>账户设置</q-item-section>
              </q-item>
              <q-item clickable tag="a" href="https://passport.escience.cn/user/password.do?act=showChangePassword"
                      target="_blank">
                <q-item-section>修改密码</q-item-section>
              </q-item>
              <q-item clickable @click="toLogout" class="bg-nord6">
                <q-item-section>退出登录</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

        </div>
      </q-toolbar>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'GlobalHeader',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const currentUser = $store.state.user

    const toLogout = () => {
      void $store.dispatch('user/logoutCstUser')
    }
    return {
      currentUser,
      toLogout

    }
  }
})
</script>

<style lang="scss" scoped>
.GlobalHeader {
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
