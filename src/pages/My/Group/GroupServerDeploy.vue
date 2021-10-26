<template>
  <div class="GroupServerDeploy">
    <div class="column q-py-md">

      <div class="col">
        <div class="row items-center title-area q-pb-md">
          <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
                 @click="$router.back()"/>
          <span>{{ $t('新建项目组云主机') }}</span>
        </div>
      </div>

      <div class="col">
        <server-deploy-card :is-group="true" :quota-id="quotaId" :service-id="serviceId" :group-id="groupId"/>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { /* computed, */ defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import ServerDeployCard from 'components/Server/ServerDeployCard.vue'
// import { useStore } from 'vuex'
// import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'GroupServerDeploy',
  components: {
    ServerDeployCard
  },
  props: {},
  setup () {
    // const $store = useStore<StateInterface>()
    const $router = useRouter()
    const $route = useRoute()
    const { locale } = useI18n({ useScope: 'global' })

    // 返回上一页
    const goBack = () => {
      $router.go(-1)
    }

    const groupId = $route.query.group as string
    const serviceId = $route.query.service as string
    const quotaId = $route.query.quota as string

    return {
      $router,
      locale,
      goBack,
      quotaId,
      serviceId,
      groupId
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
