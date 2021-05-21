<template>
  <div class="CreateDatacenter">
    <div class="column items-center justify-center">
      <div>
        <div class="col title-area q-pb-lg">
          <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
                 @click="goBack"/>
          创建数据中心
        </div>

        <div class="col">

          <div class="row items-center q-pb-md">
            <div class="col-2">数据中心全称</div>
            <div class="col-4 q-pr-md">
              <q-input filled square dense v-model="text"/>
            </div>
          </div>

          <div class="row items-center q-pb-md">
            <div class="col-2">数据中心简称</div>
            <div class="col-4 q-pr-md">
              <q-input filled square dense v-model="text"/>
            </div>
          </div>

          <div class="row items-center q-pb-md">
            <div class="col-2">是否为独立法人单位</div>
            <div class="col-4 q-pr-md">
              <q-input filled square dense v-model="text"/>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import { useStore } from 'vuex'
// import { StateInterface } from 'src/store'
import { useRouter } from 'vue-router'
// import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'CreateDatacenter',
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
    return {
      goBack
    }
  }
})
</script>

<style lang="scss" scoped>
.CreateDatacenter {
}
.title-area {
  width: $general-width-no-padding;
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
}
</style>
