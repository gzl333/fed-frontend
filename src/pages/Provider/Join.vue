<template>
  <div class="Join">
    <div class="column items-center justify-center">
      <div>
        <div class="col title-area">
          <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
                 @click="goBack"/>
          加入联邦
        </div>

        <div class="col">

          <q-stepper
            class="stepper overflow-hidden"
            v-model="step"
            header-nav
            ref="stepper"
            color="primary"
            animated
            flat
          >

            <q-step
              class="overflow-hidden"
              :name="1"
              title="机构"
              icon="settings"
              :done="done1"
            >

              <div class="column">
                <div class="col section">
                  <div class="text-h7 text-primary section-title">
                    机构
                  </div>
                  <div class="row items-center q-pb-sm">
                    <div class="col-auto">请选择服务所在的机构</div>
                    <div class="col-auto q-pl-lg">
                      <q-select
                        outlined
                        dense
                        square
                        clearable
                        v-model="selection"
                        :options="options"
                        style="width: 350px"
                      >
                        <template v-slot:no-option>
                          <q-item>
                            <q-item-section class="text-grey">
                              未找到该机构
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>

                    </div>
                  </div>
                  <div>没有找到？
                    <q-btn label="创建新的机构" padding="none" dense flat color="primary" :to="{ path: '/my/provider/create' }"/>
                  </div>

                </div>
              </div>
              <q-stepper-navigation>
                <q-btn :disabled="!selection" @click="() => { done1 = true; step = 2 }" unelevated color="primary"
                       label="继续"/>
              </q-stepper-navigation>

            </q-step>

            <q-step
              class="overflow-hidden"
              :name="2"
              title="服务信息"
              icon="create_new_folder"
              :done="done2"
            >
              <div class="col section">
                <div class="text-h7 text-primary section-title">
                  服务信息
                </div>

                <div class="row items-center q-pb-md">
                  <div class="col-1">服务名称</div>
                  <div class="col-4 q-pr-md">
                    <q-input filled square dense v-model="text"/>
                  </div>
                </div>

                <div class="row items-center q-pb-md">
                  <div class="col-1">服务类型</div>
                  <div class="col-4 q-pr-md">
                    <q-select outlined square dense v-model="model" :options="options"/>
                  </div>
                </div>

                <div class="row items-center q-pb-md">
                  <div class="col-1">服务URL</div>
                  <div class="col-4 q-pr-md">
                    <q-input filled square dense v-model="text"/>
                  </div>
                  <div class="col-1 text-center">服务用户名</div>
                  <div class="col-2 q-pr-md">
                    <q-input filled square dense v-model="text"/>
                  </div>
                  <div class="col-1 text-center ">服务密码</div>
                  <div class="col-2 q-pr-md">
                    <q-input filled square dense v-model="text"/>
                  </div>
                </div>

                <div class="row items-center q-pb-md">
                  <div class="col-1">VPN URL</div>
                  <div class="col-4 q-pr-md">
                    <q-input filled square dense v-model="text"/>
                  </div>
                  <div class="col-1 text-center">VPN用户名</div>
                  <div class="col-2 q-pr-md">
                    <q-input filled square dense v-model="text"/>
                  </div>
                  <div class="col-1 text-center">VPN密码</div>
                  <div class="col-2 q-pr-md">
                    <q-input filled square dense v-model="text"/>
                  </div>
                </div>

                <div class="row items-center q-pb-md">
                  <div class="col-1">地理位置</div>
                  <div class="col-2 q-pr-md">
                    <q-input filled square dense v-model="text" label="经度"/>
                  </div>
                  <div class="col-2 q-pr-md">
                    <q-input filled square dense v-model="text" label="纬度"/>
                  </div>
                </div>

                <div class="row items-center q-pb-md">
                  <div class="col-1">上传附件</div>
                  <div class="col-7 q-pr-md">
                    <q-uploader
                      style=""
                      flat
                      bordered
                      square
                      color="grey"
                      url="http://localhost:4444/upload"
                      label="选择上传文件"
                      multiple
                      max-file-size="20480"
                      @rejected="onRejected"
                    />
                  </div>
                </div>

              </div>
              <q-stepper-navigation>
                <q-btn @click="() => { done2 = true; step = 3 }" color="primary" label="继续" unelevated/>
                <q-btn flat @click="step = 1" color="primary" label="返回" class="q-ml-sm"/>
              </q-stepper-navigation>
            </q-step>

            <q-step
              class="overflow-hidden"
              :name="3"
              title="联系方式"
              icon="create_new_folder"
              :done="done3"
            >
              <div class="col section">
                <div class="text-h7 text-primary section-title">
                  联系方式
                </div>

                <div class="row items-center q-pb-md">
                  <div class="col-1">姓名</div>
                  <div class="col-4 q-pr-md">
                    <q-input filled square dense v-model="text"/>
                  </div>
                </div>

                <div class="row items-center q-pb-md">
                  <div class="col-1">邮箱</div>
                  <div class="col-4 q-pr-md">
                    <q-input filled square dense v-model="text"/>
                  </div>
                </div>

                <div class="row items-center q-pb-md">
                  <div class="col-1">手机</div>
                  <div class="col-4 q-pr-md">
                    <q-input filled square dense v-model="text"/>
                  </div>
                </div>

                <div class="row items-center q-pb-md">
                  <div class="col-1">座机</div>
                  <div class="col-4 q-pr-md">
                    <q-input filled square dense v-model="text"/>
                  </div>
                </div>

                <div class="row items-center q-pb-md">
                  <div class="col-1">地址</div>
                  <div class="col-4 q-pr-md">
                    <q-input filled square dense v-model="text"/>
                  </div>
                </div>

              </div>
              <q-stepper-navigation>
                <q-btn @click="() => { done3 = true; step = 4 }" color="primary" label="继续" unelevated/>
                <q-btn flat @click="step = 2" color="primary" label="返回" class="q-ml-sm"/>
              </q-stepper-navigation>
            </q-step>

            <q-step
              class="overflow-hidden"
              :name="4"
              title="确认提交"
              icon="add_comment"
              :done="done4"
            >

              <div class="col section">
                <div class="text-h7 text-primary section-title">
                  所填信息
                </div>
                <div class="row">
                  <div class="col-auto column justify-center q-pr-xl">
                    <div class="col">
                      <div class="row item-row">
                        <div class="col-shrink item-title-narrow text-grey">
                          机构
                        </div>
                        <div class="col item-radios">
                          service name
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="col-shrink item-title-narrow text-grey">
                          服务名称
                        </div>
                        <div class="col item-radios">
                          service name
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="col-shrink item-title-narrow text-grey">
                          服务类型
                        </div>
                        <div class="col item-radios">
                          service name
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="col-shrink item-title-narrow text-grey">
                          服务URL
                        </div>
                        <div class="col item-radios">
                          service name
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="col-shrink item-title-narrow text-grey">
                          服务用户名
                        </div>
                        <div class="col item-radios">
                          service name
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="col-shrink item-title-narrow text-grey">
                          服务密码
                        </div>
                        <div class="col item-radios">
                          service name
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="col-shrink item-title-narrow text-grey">
                          VPN URL
                        </div>
                        <div class="col item-radios">
                          service name
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="col-shrink item-title-narrow text-grey">
                          VPN用户名
                        </div>
                        <div class="col item-radios">
                          service name
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="col-shrink item-title-narrow text-grey">
                          VPN密码
                        </div>
                        <div class="col item-radios">
                          service name
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="col-shrink item-title-narrow text-grey">
                          地理经纬度
                        </div>
                        <div class="col item-radios">
                          service name
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-auto column justify-center q-pr-xl">
                    <div class="col">

                      <div class="row item-row">
                        <div class="col-shrink item-title-narrow text-grey">
                          联系人姓名
                        </div>
                        <div class="col item-radios">
                          service name
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="col-shrink item-title-narrow text-grey">
                          邮箱
                        </div>
                        <div class="col item-radios">
                          service name
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="col-shrink item-title-narrow text-grey">
                          手机
                        </div>
                        <div class="col item-radios">
                          service name
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="col-shrink item-title-narrow text-grey">
                          座机
                        </div>
                        <div class="col item-radios">
                          service name
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="col-shrink item-title-narrow text-grey">
                          通讯地址
                        </div>
                        <div class="col item-radios">
                          service name
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <q-stepper-navigation>
                <q-btn color="primary" @click="applyQuota" label="提交申请" unelevated :loading="isCreating"/>
                <q-btn flat @click="step = 3" color="primary" label="返回" class="q-ml-sm"/>
              </q-stepper-navigation>
            </q-step>
          </q-stepper>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useRouter } from 'vue-router'
// import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'Join',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $router = useRouter()
    // const $q = useQuasar()

    // 返回上一页
    const goBack = () => {
      $router.go(-1)
    }

    // stepper
    const step = ref(1)
    const done1 = ref(false)
    const done2 = ref(false)
    const done3 = ref(false)
    const done4 = ref(false)
    const reset = () => {
      done1.value = false
      done2.value = false
      done3.value = false
      done4.value = false
      step.value = 1
    }

    const dataCenterOptions = computed(() => $store.getters['vm/getDataCenterOptions'])
    const options = ref(dataCenterOptions)
    const selection = ref(null)
    return {
      goBack,
      step,
      done1,
      done2,
      done3,
      done4,
      reset,
      selection,
      options
    }
  }
})
</script>

<style lang="scss" scoped>
.Join {
}

.title-area {
  width: $general-width-no-padding;
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
}

.stepper {
  width: $general-width-no-padding;
}

.section {
  margin-bottom: 30px;
  padding: 10px 20px;
  border: 1px solid $grey-4;
  //border-radius: 5px;
}

.section-title {
  padding-bottom: 15px;
}

.item-row {
  padding: 5px 0;
}

.item-title {
  text-align: left;
  padding-right: 50px;
  min-width: 250px;
}

.item-title-narrow {
  text-align: left;
  padding-right: 50px;
  min-width: 130px;
}

.radio {
  margin-bottom: 20px;
  padding: 0 10px;
}
</style>
