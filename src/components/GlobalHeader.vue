<template>
  <div class="GlobalHeader">
    <el-row type="flex" justify="space-between">
      <el-col :xs="12" :sm="8" :md="6" :lg="10" :xl="12">
        <div class="grid-content">
          <router-link :to="{ name: 'home' }">
            <img src="@/assets/banner.png" class="logo"/>
          </router-link>
          <!--          <router-link :to="{ name: 'main' }">-->
          <!--            <button>dev进入后台</button>-->
          <!--          </router-link>-->
        </div>
      </el-col>

      <el-col :xs="0" :sm="10" :md="12" :lg="8" :xl="8">
        <div class="grid-content float-to-right">
          <el-menu
            v-if="currentPosition === 'Home'"
            :default-active="1"
            mode="horizontal"
            background-color="transparent"
            text-color="#fff"
            active-text-color="#409eff"
            router="true"
          >
            <el-menu-item index="1" v-if="!user.isLogin" class="item-on-show" :route="{ name: 'home' }">
              首页
            </el-menu-item>
            <el-menu-item index="2" v-if="!user.isLogin" class="item-on-show" :route="{ name: 'home' }">
              资源&服务
            </el-menu-item>
            <el-menu-item index="3" v-if="!user.isLogin" class="item-on-show" :route="{ name: 'home' }">
              资源提供者
            </el-menu-item>
            <el-menu-item index="4" v-if="!user.isLogin" class="item-on-show" :route="{ name: 'home' }">
              开发者
            </el-menu-item>
            <div v-else>
              <el-menu-item index="5" class="item-on-show" :route="{ name: 'main' }">使用资源</el-menu-item>
            </div>
          </el-menu>
        </div>
      </el-col>

      <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="4">
        <div class="grid-content float-to-right">
          <div v-if="!user.isLogin">
            <router-link :to="{ name: 'login' }">
              <el-button class="button-login" type="primary">登 录</el-button>
            </router-link>
            <router-link :to="{ name: 'login' }">
              <el-button :route="{ name: 'login' }" class="button-login">注 册</el-button>
            </router-link>
            <router-link :to="{ name: 'home' }">
              <el-button type="text"> ENG</el-button>
            </router-link>
          </div>

          <el-menu
            v-if="user.isLogin"
            :default-active="3"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#040c20"
            text-color="#fff"
            active-text-color="#409eff">

            <el-submenu index="1" :popper-append-to-body="false">
              <template #title><i class="el-icon-question"></i></template>
              <el-menu-item index="1-1">操作手册</el-menu-item>
              <el-menu-item index="1-2">API</el-menu-item>
            </el-submenu>

            <el-submenu index="2" :popper-append-to-body="false">
              <template #title><i class="el-icon-message-solid"></i></template>
              <el-menu-item index="2-1">系统通知：您的资源已经超期。</el-menu-item>
              <el-menu-item index="2-2">管理员通知：系统将在如下日期进行升级。。。</el-menu-item>
            </el-submenu>

            <el-submenu index="3" :popper-append-to-body="false">
              <template #title>
                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
              </template>
              <el-menu-item index="3-1">{{ user.name }}的个人设置</el-menu-item>
              <el-menu-item index="3-2" @click="handleLogout">退出登录</el-menu-item>
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
import { useRouter } from 'vue-router'
import { GlobalDataProps } from '@/store/index.ts'

export default defineComponent({
  name: 'Header',
  components: {},
  props: {},
  setup () {
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const currentPosition = computed(() => store.state.position.slice(-1)[0])
    const user = computed(() => store.state.user)
    const handleLogout = () => {
      store.commit('logoutUser')
      router.push({ name: 'home' })
    }
    return {
      user,
      currentPosition,
      handleLogout
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

.middle-col {
  float: right;
}

.el-menu.el-menu--horizontal {
  border-bottom: none;
}

.float-to-right {
  float: right;
}

.el-submenu >>> .el-popper.is-light {
  border: none;
  background-color: transparent;
}

.button-login {
  padding: 5px 25px;
  margin: 0px 5px;
}
</style>
