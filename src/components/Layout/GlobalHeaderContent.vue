<template>
  <div class="GlobalHeaderContent ">
    <div class="row">
      <q-toolbar class="q-pa-none">
        <q-toolbar-title shrink>
          <!--中英文静态资源的替换-->
          <!--          <img :src="$t('resource.title')" alt="中国科技云联邦" class="title q-pt-sm">-->

          <q-icon v-if="$i18n.locale==='zh'" name="img:svg/fed-title-cn.svg"
                  style="width: 250px;height: 30px; opacity: 0.7;"/>
          <!--          <q-icon v-else name="img:svg/fed-title-en.svg"-->
          <!--                  color="" style="width: 270px;height: 30px; opacity: 0.7;"/>-->
          <q-icon v-else name="img:svg/fed-title-en-bold.svg"
                  style="width: 280px;height: 30px; opacity: 0.7;"/>

        </q-toolbar-title>

        <q-space/>

        <div class="q-gutter-lg row items-center no-wrap">
          <q-select
            v-model="$i18n.locale"
            :options="localeOptions"
            color="grey"
            dense
            borderless
            emit-value
            map-options
            options-dense
          >
            <template v-slot:prepend>
              <q-icon class="q-pa-none q-ma-none" name="language"/>
            </template>
          </q-select>

          <q-btn class="text-weight-regular" color="grey-8" :ripple="false" flat dense no-caps no-wrap
                 icon="mdi-book-open-outline" @click="gotoManual">
            {{ $t('使用手册') }}
          </q-btn>

          <q-btn v-if="isDev"  :ripple="false" flat dense color="grey" icon="notifications" @click="toggleRightDrawer">
            <q-badge color="c-blue-3" text-color="white" floating>
              7
            </q-badge>
          </q-btn>

          <HeaderDropdown/>

        </div>
      </q-toolbar>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

import { StateInterface } from 'src/store'

import HeaderDropdown from 'components/Layout/HeaderDropdown.vue'

export default defineComponent({
  name: 'GlobalHeaderContent',
  components: { HeaderDropdown },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $q = useQuasar()
    const { locale } = useI18n({ useScope: 'global' })

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

    // 根据locale,改变Quasar Language Pack
    watch(locale, val => {
      // 因本地i18n简化为zh和en，此处应补全为'zh-CN'和'en-US'供quasar寻址使用
      const locale = val.includes('zh') ? 'zh-CN' : 'en-US'
      void import('quasar/lang/' + locale).then(lang => {
        $q.lang.set(lang.default)
      })
    })

    const toggleRightDrawer = () => {
      $store.commit('account/storeIsRightDrawerOpen')
    }

    const gotoManual = () => {
      // 中文访问/manual 英文访问/manual/en
      const url = computed(() => location.origin + (locale.value === 'zh' ? '/manual' : '/manual/en'))
      window.open(url.value)
    }

    const isDev = computed(() => process.env.DEV)

    return {
      localeOptions,
      toggleRightDrawer,
      gotoManual,
      isDev
    }
  }
})
</script>

<style lang="scss" scoped>
.GlobalHeaderContent {
}

.title {
  opacity: .7;
  height: 40px;
}

</style>
