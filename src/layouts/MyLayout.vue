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
          <q-btn round  flat color="grey-5" icon="library_books" v-if="$q.screen.gt.sm">
            <q-tooltip>使用手册</q-tooltip>
          </q-btn>
          <q-btn round flat color="grey-5" icon="notifications" @click="toggleMsgDrawer" >
            <q-badge color="red" text-color="white" floating>
              2
            </q-badge>
            <q-tooltip>系统消息</q-tooltip>
          </q-btn>
          <q-btn round flat @click="toggleUserDrawer">
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <q-tooltip>我的账户</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="165"
      :breakpoint="500"
      class="bg-nord3 text-white"
    >
      <q-scroll-area class="fit">
        <q-list >
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

          <q-item clickable disable >
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

    <q-drawer v-model="userDrawerOpen" side="right" bordered :width="300">
     <user-drawer/>
    </q-drawer>

    <q-page-container>
        <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import UserDrawer from '../components/UserDrawer'

export default {
  name: 'MyLayout.vue',
  components: {
    UserDrawer
  },
  props: {},
  setup () {
    const leftDrawerOpen = ref(false)
    const userDrawerOpen = ref(false)
    const toggleUserDrawer = () => {
      userDrawerOpen.value = !userDrawerOpen.value
    }

    const msgDrawerOpen = ref(false)
    const toggleMsgDrawer = () => {
      msgDrawerOpen.value = !msgDrawerOpen.value
    }
    const activeItem = ref('main')

    return {
      leftDrawerOpen,
      userDrawerOpen,
      msgDrawerOpen,
      toggleUserDrawer,
      toggleMsgDrawer,
      activeItem
    }
  }
}
</script>

<style lang="scss" scoped>
.logo {
  height: 50px;
}
.active-item {
  color: white;
  background: $nord7;
}

</style>
