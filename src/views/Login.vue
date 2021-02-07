<template>
  <el-scrollbar>
    <div class="Login">
        <el-row >
          <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
            <div class="login-main">
              <div>科技云通行证登录</div>
              <el-input v-model="inputAccount" placeholder="账号"></el-input>
              <el-input v-model="inputPassword" placeholder="密码" show-password></el-input>
              <div class="forgot-pwd"><a href="">忘记密码</a></div>
              <el-button type="primary" @click="handleLogin(inputAccount, inputPassword)">登 录</el-button>
              <div class="register">没有账号？<a href="">立即注册</a></div>
            </div>
          </el-col>
        </el-row>
      <div class="footer">©CNIC 2021</div>
    </div>
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { GlobalDataProps, UserProps } from '@/store/index.ts'

export default defineComponent({
  name: 'Login',
  components: {},
  props: {},
  setup () {
    // for dev
    const testAdmin: UserProps = {
      isLogin: true,
      id: 1,
      name: 'testAdmin',
      role: 'manager'
    }
    //
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const handleLogin = (inputAccount: string, inputPassword: string) => {
      if (inputAccount === 'testAdmin' && inputPassword === 'testAdmin') {
        store.commit('loginUser', testAdmin)
        router.push({ name: 'main' })
      }
    }
    return {
      inputAccount: ref(testAdmin.name),
      inputPassword: ref(testAdmin.name),
      handleLogin
    }
  }
})
</script>

<style scoped>
.Login {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}
.Login .el-row {
  min-height: calc(100vh - 120px);
  padding-top: calc(50vh - 300px);
}
.login-main {
  background-color: #fff;
  margin-left: calc(50vw - 200px);
  line-height: 60px;
  width: 300px;
  padding: 50px;
  border: 1px solid #d3dce6;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
.login-main .forgot-pwd {
  float: right;
  font-size: x-small;
}
.login-main .el-button {
  width: inherit;
}
.login-main .register {
  font-size: x-small;
}
.footer {
  background-color: #040c20;
  line-height: 60px;
  color: #fff;
}
</style>
