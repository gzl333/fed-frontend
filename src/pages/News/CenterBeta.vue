<template>
  <div class="CenterBeta">
    <div class="column items-center">
      <div class="col-auto title-area text-center">
        <div class="text-white text-h3">内测公告</div>
      </div>

      <div class="col-auto card-area">

        <q-card class="q-my-xl shadow-24">
          <!--        <img src="https://cdn.quasar.dev/img/mountains.jpg">-->
          <q-card-section>
            <div class="text-h6">中国科技云联邦将开启网络中心内部使用测试。用户可申请测试配额，并使用配额创建云主机。</div>
            <div class="text-h6 q-pb-md">内测时间：2021.10.26 - 2021.10.29</div>
            <div class="text-h6">本次内测配额统一规格为:</div>
            <div class="text-h6">CPU： 8核</div>
            <div class="text-h6">内存： 16GB</div>
            <div class="text-h6">公网IP： 1个</div>
            <div class="text-h6">操作系统可选： Windows10/WindowsServer2019/Centos8 Stream/Centos7/Ubuntu2004</div>
            <div class="text-h6">云主机可用时长：100天</div>
          </q-card-section>

          <q-card-section>
            <div class="text-h6">内测活动联系人: 科技云部 余宁</div>
            <div class="text-h6">Email: yuning@cstnet.cn</div>
            <!--            <div class="text-h6">电话: 58812831</div>-->
          </q-card-section>

          <q-card-section class="q-pt-md">
            <div class="text-h6">参与方法：</div>

            <div class="text-h6">1. 点击以下按钮，申请云主机配额</div>

            <q-btn class="q-px-xl"
                   unelevated color="primary" size="md" padding="sm"
                   @click="gotoApply">
              申请内测配额
            </q-btn>

            <div class="text-h6">2. 等待配额批准后，使用配额
              <q-btn flat color="primary" size="md" padding="none"
                     @click="gotoDeploy">
                <div class="text-h6">创建云主机</div>
              </q-btn>
            </div>

            <div class="text-h6">3. 根据需要使用云主机，具体使用方法请参考
              <q-btn flat padding="none" color="primary" @click="gotoManual">
                <div class="text-h6">用户手册</div>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ClosedBeta',
  components: {},
  props: {},
  setup () {
    const gotoApply = () => {
      const url = location.origin + '/my/personal/quota/apply_beta'
      window.open(url)
    }

    const gotoDeploy = () => {
      const url = location.origin + '/my/personal/server/deploy'
      window.open(url)
    }

    const gotoManual = () => {
      // 中文访问/manual 英文访问/manual/en
      const url = location.origin + '/manual/personal/'
      window.open(url)
    }

    return {
      gotoApply,
      gotoDeploy,
      gotoManual
    }
  }
})
</script>

<style lang="scss" scoped>
.CenterBeta {
  width: 100vw;
  background: linear-gradient(90deg, #191654, #43C6AC);
  min-height: calc(100vh - #{$global-footer-height});
}

.title-area {
  padding-top: 150px;
}

.card-area {
  width: 1000px;
}

.activity-card {
  width: 420px;
}
</style>
