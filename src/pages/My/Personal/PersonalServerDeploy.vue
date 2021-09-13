<template>
  <div class="PersonalServerDeploy">
    <div class="column q-py-md">

      <div class="col q-pb-md title-area">
        <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
               @click="goBack"/>
        {{ $t('创建个人云主机') }}
      </div>

      <div class="col">
        <server-deploy-card :is-group="false" :quota-id="quotaId" :service-id="serviceId"/>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ServerDeployCard from 'components/Server/ServerDeployCard.vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'PersonalServerDeploy',
  components: { ServerDeployCard },
  props: {},
  setup () {
    const $router = useRouter()
    const $route = useRoute()
    const { locale } = useI18n({ useScope: 'global' })
    // 返回上一页
    const goBack = () => {
      $router.go(-1)
    }

    const serviceId = $route.query.service as string
    const quotaId = $route.query.quota as string

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
.PersonalServerDeploy {
}

.title-area {
  width: $general-width-no-padding;
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
}
</style>
