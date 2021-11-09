<template>

    <div class="column full-height bg-c-blue1 text-white">
      <q-scroll-area class="col overflow-hidden non-selectable visible">

        <q-list>

          <q-item>
            <q-item-section class="column items-center q-py-sm">
              <img src="fedlogo.png" class="logo" />
            </q-item-section>
          </q-item>

          <q-item
            clickable
            :active="activeItem === 'main'"
            @click="activeItem = 'main'"
            active-class="active-item"
            to='/my/main'
          >
            <q-item-section class="column items-center">
              <q-icon name="home" size="lg"/>
              <div class="text-c-blue5 text-bold text-center line-height-1em">{{ $t('我的首页') }}</div>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            :active="activeItem === 'personal'"
            @click="activeItem = 'personal'"
            active-class="active-item"
            to='/my/personal'
          >
            <q-item-section class="column items-center">
              <q-icon name="person" size="lg"/>
              <div class="text-c-blue5 text-bold text-center line-height-1em">{{ $t('个人资源') }}</div>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            :active="activeItem === 'group'"
            @click="activeItem = 'group'"
            active-class="active-item"
            to='/my/group'
          >
            <q-item-section class="column items-center">
              <q-icon name="group" size="lg"/>
              <div class="text-c-blue5 text-bold text-center line-height-1em">{{ $t('项目组资源') }}</div>
            </q-item-section>
          </q-item>

          <!--有服务管理权限的用户才能看到，同时在路由里进行权限限制-->
          <q-item v-if="$store.state.account.items.vmsAdmin.length > 0"
                  clickable
                  :active="activeItem === 'provider'"
                  @click="activeItem = 'provider'"
                  active-class="active-item"
                  to='/my/provider'
          >
            <q-item-section class="column items-center">
              <q-icon name="cloud_upload" size="lg"/>
              <div class="text-c-blue5 text-bold text-center line-height-1em">{{ $t('资源提供') }}</div>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            :active="activeItem === 'federation'"
            @click="activeItem = 'federation'"
            active-class="active-item"
            to='/my/federation'
          >
            <q-item-section class="column items-center">
              <q-icon name="construction" size="lg"/>
              <div class="text-c-blue5 text-bold text-center line-height-1em">{{ $t('联邦管理') }}</div>
            </q-item-section>
          </q-item>

        </q-list>

        <div class="text-grey text-body2 text-center q-pt-xl">v0.2.8 beta</div>
      </q-scroll-area>
    </div>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'GlobalLeftDrawerContent',
  components: {},
  props: {},
  setup () {
    const activeItem = ref('main')
    return {
      activeItem
    }
  }
})
</script>

<style lang="scss" scoped>
.active-item {
  //color: white !important; // 不起作用
  background-color: $c-blue-6;

}

.logo {
  height: 50px;
}
</style>
