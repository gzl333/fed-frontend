<template>
  <div class="GlobalHeader">
    <div class="row">
      <q-toolbar class="q-pa-none">
        <q-toolbar-title>
          <!--中英文静态资源的替换-->
          <img :src="$t('resource.title')" alt="中国科技云联邦" class="title q-pt-sm">
        </q-toolbar-title>

        <q-space/>
        <div class="q-gutter-md row items-center no-wrap">
          <q-select
            v-model="localeModel"
            :options="localeOptions"
            dense
            borderless
            emit-value
            map-options
            options-dense
          >
            <template v-slot:prepend>
              <q-icon name="language"/>
            </template>
          </q-select>

          <q-btn :ripple="false" disabled flat dense icon="library_books" label="使用手册"
                 @click="toggleRightDrawer">
            <q-tooltip>使用手册</q-tooltip>
          </q-btn>

          <q-btn disable :ripple="false" flat dense color="grey" icon="notifications">
            <q-badge color="c-blue-3" text-color="white" floating>
              0
            </q-badge>
            <q-tooltip>系统消息</q-tooltip>
          </q-btn>

          <HeaderDropdown/>

<!--          <q-btn-dropdown :ripple="false" flat class="q-py-sm q-px-none" :label="currentUser.cstEmail" no-caps>-->

<!--            <div class="row justify-center no-wrap q-pa-md dropdown-content non-selectable">-->
<!--              <div class="column items-center">-->
<!--                <q-avatar size="72px" class="q-mt-lg">-->
<!--                  <img src="img/default-avatar.png">-->
<!--                </q-avatar>-->
<!--                <div class="text-subtitle1 q-ma-none q-mt-md text-white">{{ currentUser.cstTrueName }}</div>-->
<!--                <div class="text-subtitle1 q-ma-none q-mb-md text-white">{{ currentUser.cstEmail }}</div>-->
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
<!--              <q-item clickable @click="toLogout" class="bg-grey-2">-->
<!--                <q-item-section>退出登录</q-item-section>-->
<!--              </q-item>-->
<!--            </q-list>-->

<!--          </q-btn-dropdown>-->

        </div>
      </q-toolbar>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import { StateInterface } from 'src/store'

import HeaderDropdown from 'components/GlobalHeader/HeaderDropdown.vue'

export default defineComponent({
  name: 'GlobalHeader',
  components: { HeaderDropdown },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // i18n
    // 保持selection与i18n模块同步
    const localeModel = computed({
      get: () => locale.value,
      set: newVal => {
        locale.value = newVal
      }
    })

    const localeOptions = [
      {
        value: 'zh',
        label: '中文'
      },
      {
        value: 'en',
        label: 'English-dev'
      }
    ]

    const currentUser = $store.state.account
    const toggleRightDrawer = () => {
      $store.commit('account/storeIsRightDrawerOpen')
    }
    const toLogout = () => {
      void $store.dispatch('account/logoutCstUser')
    }
    return {
      localeModel,
      localeOptions,
      currentUser,
      toLogout,
      toggleRightDrawer
    }
  }
})
</script>

<style lang="scss" scoped>
.GlobalHeader {
}

.title {
  opacity: .7;
  height: 40px;
}

//.dropdown-content {
//  min-width: 200px;
//  //background-image: url(https://cdn.quasar.dev/img/material.png);
//  background-color: $c-blue-3;
//  background-size: 150% auto;
//}
//
//.dropdown-items {
//  text-align: center;
//}
</style>
