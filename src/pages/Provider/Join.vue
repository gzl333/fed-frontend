<template>
  <div class="Join">
    <div class="column items-center justify-center">
      <!--      <div v-if="!dataCenters">-->
      <!--        <q-inner-loading>-->
      <!--          <q-spinner size="50px" color="primary"/>-->
      <!--        </q-inner-loading>-->
      <!--      </div>-->

      <!--      <div v-else>-->
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
              title="数据中心"
              icon="settings"
              :done="done1"
            >

              <div class="column">
                <div class="col section">
                  <div class="text-h7 text-primary section-title">
                    数据中心
                  </div>

                  <q-option-group
                    v-model="group"
                    :options="[{label: '加入现有数据中心',value: '1'},{label: '新建数据中心',value: '2'}]"
                    color="primary"
                  />

<!--                  <q-radio-->
<!--                    dense v-model="radioDatacenter" :val="1" :key="1"-->
<!--                    class="radio">-->
<!--                    <div class="row">-->
<!--                      <div class="col-auto text-bold">加入现有数据中心</div>-->
<!--                      <div class="col">selection</div>-->
<!--                    </div>-->
<!--                  </q-radio>-->

<!--                  <q-radio-->
<!--                    dense v-model="radioDatacenter" :val="1" :key="1"-->
<!--                    class="radio">-->
<!--                    <div class="row">-->
<!--                      <div class="col-auto text-bold">新建数据中心</div>-->
<!--                      <div class="col">selection</div>-->
<!--                    </div>-->
<!--                  </q-radio>-->

                </div>
              </div>
              <q-stepper-navigation>
                <q-btn @click="() => { done1 = true; step = 2 }" unelevated color="primary" label="继续"/>
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

                <div class="row item-row">
                  <div class="col-shrink item-title-narrow text-bold">
                    服务中心名称
                  </div>
                  <div class="col item-radios">
                    service name
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
import { defineComponent, ref } from 'vue'
// import { useStore } from 'vuex'
// import { StateInterface } from 'src/store'
import { useRouter } from 'vue-router'
// import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'Join',
  components: {},
  props: {},
  setup () {
    // const $store = useStore<StateInterface>()
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

    // radio
    const group = ref('1')
    const radioDatacenter = ref('')

    return {
      goBack,
      step,
      done1,
      done2,
      done3,
      done4,
      reset,
      group,
      radioDatacenter
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
  border-radius: 5px;
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
