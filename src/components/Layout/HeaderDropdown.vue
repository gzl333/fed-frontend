<template>
  <div class="HeaderDropdown">

    <q-btn-dropdown :ripple="false" flat class="q-py-none q-px-none text-weight-regular" color="grey-8" no-caps>

      <template v-slot:label >
        <q-icon name="las la-user-circle"/>
        {{ $store.state.account.items.decoded?.email }}
      </template>

      <div class="row justify-center no-wrap q-pa-md dropdown-content non-selectable">
        <div class="column items-center">
          <q-icon class="q-pt-lg q-pb-none q-ma-none" name="mdi-account" color="white" size="90px"/>
<!--          <q-icon class="q-pt-lg q-pb-none q-ma-none" name="las la-user-circle" color="white" size="90px"/>-->

          <div v-if="$store.state.account.items.fedRole === 'federal-admin'" class="q-pb-lg text-white" >
            联邦管理员
          </div>

          <div class="text-subtitle1  text-white no-wrap">{{ $store.state.account.items.decoded?.name }}</div>
          <div class="text-subtitle1 text-white no-wrap">{{ $store.state.account.items.decoded?.orgName }}</div>

          <div class="q-pt-sm text-caption text-grey-5">
            {{ $store.state.account.items.loginType === 'aai' ? $t('正在使用科技云AAI联盟登录') : $t('正在使用科技云通行证登录') }}
          </div>
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
        <q-item clickable @click="toLogout" class="bg-grey-2">
          <q-item-section>退出登录</q-item-section>
        </q-item>
      </q-list>

    </q-btn-dropdown>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'HeaderDropdown',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()

    const toLogout = () => {
      void $store.dispatch('account/cstLogout')
    }

    return {
      toLogout
    }
  }
})
</script>

<style lang="scss" scoped>
.HeaderDropdown {
}

.dropdown-content {
  min-width: 200px;
  //background-image: url(https://cdn.quasar.dev/img/material.png);
  background-color: $c-blue-4;
  //background-size: 150% auto;
}

.dropdown-items {
  text-align: center;
}
</style>
