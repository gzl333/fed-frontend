<template>
  <el-scrollbar>
    <div class="Login">
        <el-row >
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
            <div class="login-img">img</div>
          </el-col>
          <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
            <div  class="login-main">
              <div>科技云通行证登录</div>
              <el-input v-model="inputAccount" placeholder="账号"></el-input>
              <el-input v-model="inputPassword" placeholder="密码" show-password></el-input>
              <div class="forgot-pwd"><a href="">忘记密码</a></div>
              <el-button type="primary" round>登 录</el-button>
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

export default defineComponent({
  name: 'Login',
  components: {},
  props: {},
  setup () {
    return {
      inputAccount: ref(''),
      inputPassword: ref('')
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
  padding: calc(100vh - 800px) 0;
}
.login-img {
  width: 300px;
  left: calc(50vw - 400px);
}
.login-main {
  line-height: 50px;
  width: 300px;
  padding: 50px;
  border: 1px solid #d3dce6;
  border-radius: 10px;
}
.login-main .forgot-pwd {
  float: right;
  font-size: x-small;
}
.login-main .el-button {
  width: 300px;
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
