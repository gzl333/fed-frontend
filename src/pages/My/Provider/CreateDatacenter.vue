<template>
  <div class="CreateDatacenter">
    <div class="column items-center justify-center">
      <div>
        <div class="col title-area q-pb-lg">
          <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
                 @click="goBack"/>
          新建机构
        </div>

        <div class="col">

          <div class="row items-center q-pb-md">
            <div class="col-2">机构全称</div>
            <div class="col-4 q-pr-md">
              <q-input filled square dense v-model="text"/>
            </div>
          </div>

          <div class="row items-center q-pb-md">
            <div class="col-2">机构简称</div>
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

          <div class="row items-center q-pb-md">
            <div class="col-2">国家</div>
            <div class="col-2 q-pr-md">
              <q-input filled square dense v-model="text"/>
            </div>

            <div class="col-2">城市</div>
            <div class="col-2 q-pr-md">
              <q-input filled square dense v-model="text"/>
            </div>
          </div>

          <div class="row items-center q-pb-md">
            <div class="col-2">邮政编码</div>
            <div class="col-4 q-pr-md">
              <q-input filled square dense v-model="text"/>
            </div>
          </div>

          <div class="row items-center q-pb-md">
            <div class="col-2">单位地址</div>
            <div class="col-4 q-pr-md">
              <q-input filled square dense v-model="text"/>
            </div>
          </div>

          <div class="row items-center q-pb-md">
            <div class="col-2">云主机服务URL</div>
            <div class="col-4 q-pr-md">
              <q-input filled square dense v-model="text"/>
            </div>
          </div>

          <div class="row items-center q-pb-md">
            <div class="col-2">对象存储服务URL</div>
            <div class="col-4 q-pr-md">
              <q-input filled square dense v-model="text"/>
            </div>
          </div>

          <div class="row items-center q-pb-md">
            <div class="col-2">计算服务URL</div>
            <div class="col-4 q-pr-md">
              <q-input filled square dense v-model="text"/>
            </div>
          </div>

          <div class="row items-center q-pb-md">
            <div class="col-2">监控服务URL</div>
            <div class="col-4 q-pr-md">
              <q-input filled square dense v-model="text"/>
            </div>
          </div>

          <div class="row items-center q-pb-md">
            <div class="col-2">上传附件</div>
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

          <div class="row items-center q-pb-md">
            <q-btn label="提交申请"  unelevated color="primary"/>
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
