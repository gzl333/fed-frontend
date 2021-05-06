<template>
  <q-drawer
    v-model="leftDrawerOpen"
    show-if-above
    :width="120"
    :breakpoint="0"
    class="bg-c-blue1 text-white"
  >
    <div class="column full-height">
      <q-scroll-area class="col overflow-hidden non-selectable visible">

        <q-list>

          <q-item>
            <q-item-section class="column items-center q-py-sm">
              <img src="fedlogo.png" class="logo"/>
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
              <div class="text-c-blue5"> 我的首页</div>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            :active="activeItem === 'usage'"
            @click="activeItem = 'usage'"
            active-class="active-item"
            to='/my/usage'
          >

            <q-item-section class="column items-center">
              <q-icon name="cloud_done" size="lg"/>
              <div class="text-c-blue5">在用资源</div>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            :active="activeItem === 'quota'"
            @click="activeItem = 'quota'"
            active-class="active-item"
            to='/my/quota'
          >

            <q-item-section class="column items-center">
              <q-icon name="source" size="lg"/>
              <div class="text-c-blue5">资源配额</div>
            </q-item-section>
          </q-item>

          <q-separator/>

          <q-item
            clickable
            :active="activeItem === 'provider'"
            @click="activeItem = 'provider'"
            active-class="active-item"
            to='/my/provider'
          >
            <q-item-section class="column items-center">
              <q-icon name="cloud_upload" size="lg"/>
              <div class="text-c-blue5">资源提供</div>
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
              <div class="text-c-blue5">联邦管理</div>
            </q-item-section>
          </q-item>

          <q-separator/>

<!--          <q-item clickable disable class="text-center">-->
<!--            <q-item-section class="column items-center">-->
<!--              <q-icon name="group" size="lg"/>-->
<!--              <div class="text-c-blue5">我的群组</div>-->
<!--            </q-item-section>-->
<!--          </q-item>-->

<!--          <q-item clickable disable>-->
<!--            <q-item-section class="column items-center">-->
<!--              <q-icon name="paid" size="lg"/>-->
<!--              <div class="text-c-blue5">结算计费</div>-->
<!--            </q-item-section>-->
<!--          </q-item>-->

<!--          <q-item clickable disable>-->
<!--            <q-item-section class="column items-center">-->
<!--              <q-icon name="help_center" size="lg"/>-->
<!--              <div class="text-c-blue5">工单服务</div>-->
<!--            </q-item-section>-->
<!--          </q-item>-->

<!--          <q-item clickable disable>-->
<!--            <q-item-section class="column items-center">-->
<!--              <q-icon name="visibility" size="lg"/>-->
<!--              <div class="text-c-blue5">计量监测</div>-->
<!--            </q-item-section>-->
<!--          </q-item>-->

<!--          <q-item clickable disable>-->
<!--            <q-item-section class="column items-center">-->
<!--              <q-icon name="analytics" size="lg"/>-->
<!--              <div class="text-c-blue5">统计报表</div>-->
<!--            </q-item-section>-->
<!--          </q-item>-->

<!--          <q-item clickable disable>-->
<!--            <q-item-section class="column items-center">-->
<!--              <q-icon name="switch_account" size="lg"/>-->
<!--              <div class="text-c-blue5">用户管理</div>-->
<!--            </q-item-section>-->
<!--          </q-item>-->

        </q-list>
      </q-scroll-area>
    </div>
  </q-drawer>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'GlobalLeftdrawer',
  components: {},
  props: {},
  setup () {
    const leftDrawerOpen = ref(false)
    const activeItem = ref('main')
    return {
      leftDrawerOpen,
      activeItem
    }
  }
})
</script>

<style lang="scss" scoped>
.active-item {
  color: white;
  background: $c-blue-4;
}

.logo {
  height: 50px;
}
</style>
