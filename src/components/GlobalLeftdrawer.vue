<template>
  <q-drawer
    v-model="leftDrawerOpen"
    show-if-above
    :width="165"
    :breakpoint="500"
    class="bg-nord3 text-white"
  >
    <q-scroll-area class="fit non-selectable">
      <q-list>
        <q-item
          clickable
          :active="activeItem === 'main'"
          @click="activeItem = 'main'"
          active-class="active-item"
          to='/my/main'
        >
          <q-item-section avatar>
            <q-icon name="home"/>
          </q-item-section>
          <q-item-section> 我的首页</q-item-section>
        </q-item>

        <q-item
          clickable
          :active="activeItem === 'usage'"
          @click="activeItem = 'usage'"
          active-class="active-item"
          to='/my/usage'
        >
          <q-item-section avatar>
            <q-icon name="cloud_done"/>
          </q-item-section>
          <q-item-section> 在用资源</q-item-section>
        </q-item>

        <q-separator/>

        <q-item clickable disable>
          <q-item-section avatar>
            <q-icon name="group"/>
          </q-item-section>
          <q-item-section> 我的小组</q-item-section>
        </q-item>

        <q-item clickable disable>
          <q-item-section avatar>
            <q-icon name="paid"/>
          </q-item-section>
          <q-item-section> 结算计费</q-item-section>
        </q-item>

        <q-item clickable disable>
          <q-item-section avatar>
            <q-icon name="cloud_upload"/>
          </q-item-section>
          <q-item-section> 已供资源</q-item-section>
        </q-item>

        <q-item clickable disable>
          <q-item-section avatar>
            <q-icon name="help_center"/>
          </q-item-section>
          <q-item-section> 工单服务</q-item-section>
        </q-item>

        <q-item clickable disable>
          <q-item-section avatar>
            <q-icon name="build_circle"/>
          </q-item-section>
          <q-item-section> 资源管理</q-item-section>
        </q-item>

        <q-item clickable disable>
          <q-item-section avatar>
            <q-icon name="visibility"/>
          </q-item-section>
          <q-item-section> 计量监测</q-item-section>
        </q-item>

        <q-item clickable disable>
          <q-item-section avatar>
            <q-icon name="analytics"/>
          </q-item-section>
          <q-item-section> 统计报表</q-item-section>
        </q-item>

        <q-item clickable disable>
          <q-item-section avatar>
            <q-icon name="construction"/>
          </q-item-section>
          <q-item-section> 联邦维护</q-item-section>
        </q-item>

        <q-item clickable disable>
          <q-item-section avatar>
            <q-icon name="switch_account"/>
          </q-item-section>
          <q-item-section> 用户管理</q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
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
  background: $nord7;
}
</style>
