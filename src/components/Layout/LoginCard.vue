<template>
  <div class="LoginCard">
    <q-card class="login-card text-nord1">
      <q-card-section class="row justify-center items-center">
        <div class="col text-h6">科技云联邦账户登录</div>
        <q-space/>
        <q-btn icon="close" size="xs" flat dense v-close-popup/>
      </q-card-section>

      <q-separator color="#333" inset/>

      <q-card-section class="">
        <q-form
          class="column items-center q-gutter-x-md q-gutter-y-lg q-mt-md "
          @submit="toLogin"
        >
          <q-input outlined v-model="username" placeholder="电子邮箱" lazy-rules class="login-input col" color="nord10"
                   :rules="[ val => val.trim().length > 0 || '电子邮箱地址不可为空']" @change="isShowWarning=false">
            <template v-slot:prepend>
              <q-icon name="email" color="nord10"/>
            </template>
          </q-input>

          <q-input v-model="password" outlined :type="isPwd ? 'password' : 'text'" placeholder="密码" lazy-rules
                   class="login-input col " color="nord10" :rules="[ val => val.trim().length > 0 || '密码不可为空']"
                   @change="isShowWarning=false">
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

          <q-btn label="登 录" type="submit" color="nord10" :ripple="false"
                 class="login-btn col text-nord6 q-my-none"
          />
          <div class="q-pa-md q-my-none">
            <q-btn flat :ripple="false" type="a" label="科技云通行证账户登录" color="nord10"
                   class="q-ma-none q-pa-none" @click="cstLogin"/>
            <q-btn flat :ripple="false" type="a" label="test" color="nord10"
                   class="q-ma-none q-pa-none" @click="test"/>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { StateInterface } from '../../store'

export default defineComponent({
  name: 'LoginCard',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $router = useRouter()

    const username = ref('')
    const password = ref('')
    const isPwd = ref(true)
    const isShowWarning = ref(false)
    // gosc本地用户登录
    const toLogin = async () => {
      const payload = {
        username: username.value,
        password: password.value
      }
      const response = await $store.dispatch('user/fetchGoscToken', payload)
      await $store.dispatch('user/storeUser', {
        ...response.data,
        email: payload.username
      })
      await $store.dispatch('user/retainToken')
      await $router.push('/my')
    }

    // const cstLoginRedirect = () => {
    //   window.location.href = 'http://159.226.235.50/open/api/UMTOauthLogin/askUrlRedirect?clientUrl=http://127.0.0.1:8080/login'
    // }
    return {
      username,
      password,
      isPwd,
      toLogin,
      isShowWarning
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

.login-forget {
  top: -17px;
}

.login-warning {
  //line-height: 0;
  //top: -20px;
}
</style>
