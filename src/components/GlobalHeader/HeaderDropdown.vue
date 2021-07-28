<template>
  <div class="HeaderDropdown">

    <q-btn-dropdown :ripple="false" flat class="q-py-sm q-px-none" :label="currentUser.cstEmail" no-caps>

      <div class="row justify-center no-wrap q-pa-md dropdown-content non-selectable">
        <div class="column items-center">
          <q-avatar size="72px" class="q-mt-lg">
            <img src="img/default-avatar.png">
          </q-avatar>
          <div class="text-subtitle1 q-ma-none q-mt-md text-white">{{ currentUser.cstTrueName }}</div>
          <div class="text-subtitle1 q-ma-none q-mb-md text-white">{{ currentUser.cstEmail }}</div>
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
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'HeaderDropdown',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()

    const currentUser = computed(() => $store.state.account)

    const toLogout = () => {
      void $store.dispatch('account/logoutCstUser')
    }

    return {
      currentUser,
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
