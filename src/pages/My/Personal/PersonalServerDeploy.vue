<template>
  <div class="PersonalServerDeploy">
    <div class="column q-py-md">

      <div class="col">
        <div class="row items-center title-area q-pb-md">
          <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
                 @click="$router.back()"/>
          <span>{{ $t('新建个人云主机') }}</span>
        </div>
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
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'PersonalServerDeploy',
  components: { ServerDeployCard },
  props: {},
  setup () {
    const $route = useRoute()
    const { locale } = useI18n({ useScope: 'global' })

    const serviceId = $route.query.service as string
    const quotaId = $route.query.quota as string

    return {
      locale,
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
