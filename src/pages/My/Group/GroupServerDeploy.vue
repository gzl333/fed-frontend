<template>
  <div class="GroupServerDeploy">

    <div class="column q-py-md">

      <div class="col q-pb-md title-area">
        <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
               @click="goBack"/>
        {{ $t('创建项目组云主机') }}
      </div>

      <div class="col">
        <server-deploy-card :is-group="true" :quota-id="quotaId" :service-id="serviceId"/>
      </div>

    </div>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import ServerDeployCard from 'components/Server/ServerDeployCard.vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'GroupServerDeploy',
  components: {
    ServerDeployCard
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $router = useRouter()
    const $route = useRoute()
    const { locale } = useI18n({ useScope: 'global' })

    // 返回上一页
    const goBack = () => {
      $router.go(-1)
    }

    // 获取url所传参数.
    /* 传参说明：
    * 1. 都不传: 全部默认选择第一项
    * 2. 只传groupId：
    * 2. 只传quotaId: serviceId根据quotaId算出，quotaId
    * 3. 只传service：service选择指定值，quota选择第一项
    * 4. 同时传quota和service：则service被忽略
    * */
    let serviceId = computed(() => '')
    let quotaId = ''
    if ($route.query.quota) {
      quotaId = $route.query.quota as string
      serviceId = computed(() => $store.state.vm.tables.userQuotaTable.byId[quotaId]?.service)
    } else {
      if ($route.query.service) {
        serviceId = computed(() => $route.query.service as string)
      }
    }

    return {
      $router,
      locale,
      goBack,
      quotaId,
      serviceId
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupServerDeploy {
}

.title-area {
  width: $general-width-no-padding;
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
}
</style>
