<template>
  <div class="LoginCard">
    <q-card class="login-card text-nord1">
      <q-card-section class="row justify-center items-center">
        <div class="col text-h6">科技云通行证账户登录</div>
        <q-space/>
        <q-btn icon="close" size="xs" flat dense v-close-popup/>
      </q-card-section>

      <q-separator color="#333" inset/>

      <q-card-section class="column items-center q-gutter-x-md q-gutter-y-lg q-mt-md">

        <q-input outlined v-model="username" placeholder="电子邮箱" lazy-rules class="login-input col" color="nord10"
                 :rules="[ val => val.trim().length > 0 || '电子邮箱地址不可为空']">
          <template v-slot:prepend>
            <q-icon name="email" color="nord10"/>
          </template>
        </q-input>

        <q-input v-model="password" outlined :type="isPwd ? 'password' : 'text'" placeholder="密码" lazy-rules
                 class="login-input col " color="nord10" :rules="[ val => val.trim().length > 0 || '密码不可为空']">
          <template v-slot:prepend>
            <q-icon name="enhanced_encryption" color="nord10"/>
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-btn flat :ripple="false" type="a" label="忘记密码" color="nord10"
               href="https://passport.escience.cn/findPsw.do?act=stepOne" target="_blank"
               class="login-forget q-my-none q-mr-xl q-pa-none col self-end"/>
        <div v-if="isShowWarning" class="login-input col text-nord11">{{warningContent}}</div>
        <q-btn @click="toLogin" label="登 录" type="submit" color="nord10" :ripple="false"
               class="login-btn col text-nord6" :loading="isLogging"
        />
        <div class="q-pa-md q-my-none">
          没有科技云通行证账户？
          <q-btn flat :ripple="false" type="a" label="注册" color="nord10" href="https://passport.escience.cn/regist.jsp"
                 target="_blank" class="q-ma-none q-pa-none"/>
        </div>

      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios, { AxiosError, AxiosResponse } from 'axios'

export default defineComponent({
  name: 'LoginCard',
  components: {},
  props: {},
  setup () {
    const username = ref('zlguo@cnic.cn')
    const password = ref('gosc2020')
    const isPwd = ref(true)
    const isShowWarning = ref(false)

    const router = useRouter()
    const apiBaseDev = 'api_dev'
    const apiBaseProd = 'http://gosc.cstcloud.cn/api'
    const apiBase = process.env.NODE_ENV === 'production' ? apiBaseProd : apiBaseDev
    const api = apiBase + '/jwt/'
    const warningContent = ref('')
    const isLogging = ref(false)

    const toLogin = () => {
      isLogging.value = true
      const data = {
        username: username.value,
        password: password.value
      }
      axios.post(api, data)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            isLogging.value = false
            // save jwt in vuex
            console.log(response.data.access!)
            console.log(response.data.refresh!)
            // redirect to /my
            router.push('/my')
          }
        })
        .catch((error: AxiosError) => {
          isLogging.value = false
          if (error.response!.status === 401) {
            warningContent.value = '电子邮箱地址或密码错误'
            isShowWarning.value = true
            isLogging.value = false
          } else {
            warningContent.value = error.message
          }
        })
    }
    return {
      username,
      password,
      isPwd,
      toLogin,
      isShowWarning,
      warningContent,
      isLogging
    }
  }
})
</script>

<style lang="scss" scoped>
.LoginCard {
}
.login-card {
  text-align: center;
  min-width: 400px;
  min-height: 450px;
  background: transparentize($nord6, .1);
}
.login-btn {
  width: 300px;
  line-height: 45px;
}
.login-input {
  width: 300px;
}
</style>
