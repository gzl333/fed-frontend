<template>
  <div class="GlobalHeader">
    <el-row type="flex" justify="space-between">
      <el-col :xs="6" :sm="8" :md="6" :lg="6" :xl="6">
        <div class="grid-content">
          <router-link :to="{ name: 'home' }">
            <img src="@/assets/banner.png" class="logo"/>
          </router-link>
        </div>
      </el-col>

      <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
        <div class="grid-content">
          <router-link :to="{ name: 'main' }">
            <el-button type="danger">dev:进入后台</el-button>
          </router-link>
        </div>
      </el-col>

      <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
        <div class="grid-content right-most">
          <el-menu
            v-if="!user.isLogin"
            :default-active="1"
            mode="horizontal"
            background-color="transparent"
            text-color="#fff"
            active-text-color="#409eff"
            @select="handleSelect"
          >
            <el-menu-item index="1"> 首页</el-menu-item>
            <el-menu-item index="2"> 资源&服务</el-menu-item>
            <el-menu-item index="3"> 资源提供者</el-menu-item>

            <el-button>登 录</el-button>
            <el-button type="primary">注 册</el-button>

            <el-button type="text"> English</el-button>
          </el-menu>

          <el-menu
            :default-active="1"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#040c20"
            text-color="#fff"
            active-text-color="#409eff">

            <el-submenu index="1">
              <template #title>帮助</template>
              <el-menu-item index="1-1">操作手册</el-menu-item>
              <el-menu-item index="1-2">API</el-menu-item>
            </el-submenu>

            <el-submenu index="2">
              <template #title>消息通知</template>
              <el-menu-item index="2-1">系统通知：您的资源已经超期。</el-menu-item>
              <el-menu-item index="2-2">管理员通知：系统将在如下日期进行升级。。。</el-menu-item>
            </el-submenu>

            <el-submenu index="3">
              <template #title>{{ user.name }}的信息</template>
              <el-menu-item index="3-1">个人设置</el-menu-item>
              <el-menu-item index="3-2">退出登录</el-menu-item>
            </el-submenu>

          </el-menu>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store/index.ts'

export default defineComponent({
  name: 'Header',
  components: {},
  props: {},
  setup () {
    const notificationValue = 2
    const store = useStore<GlobalDataProps>()
    const user = computed(() => store.state.user)
    return {
      user,
      notificationValue
    }
  }
})
</script>

<style scoped>
.GlobalHeader {
}

.el-row {
  z-index: 10;
  padding-left: 10px;
  padding-top: 10px;
  background-color: #040c20;
}

.grid-content {
  height: 50px;
  float: left;
  color: #ffffff;
}

.logo {
  height: 40px;
}

.el-menu {
  top: -10px;
}

.el-menu.el-menu--horizontal {
  border-bottom: none;
}

.right-most {
  float: right;
}
</style>
