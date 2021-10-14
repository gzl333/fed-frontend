<template>
  <div class="ServerDeployCard">

    <div v-if="!dataCenters">
      <q-inner-loading>
        <q-spinner size="50px" color="primary"/>
      </q-inner-loading>
    </div>

    <div v-else>

      <div v-if="isGroup" class="section">
        <div class="text-h7 text-primary section-title">
          {{ $t('项目组') }}
        </div>
        <div class="row items-center q-gutter-md q-pb-lg">
          <div class="col-auto ">
            {{ $t('使用该云主机的项目组') }}
          </div>
          <q-select v-if="groups.length !== 0" class="col-4" outlined v-model="radioGroup" dense
                    :options="groups" map-options emit-value option-label="name" option-value="id"/>
          <div v-else>
            <div class="row items-center">
              {{ $t('暂无项目组，请') }}
              <q-btn v-if="isGroup" flat padding="none" color="primary"
                     :to="'/my/group/create'">
                {{ $t('创建项目组') }}
              </q-btn>
            </div>
          </div>
        </div>
      </div>

      <div class="col section">
        <div class="text-h7 text-primary section-title">
          {{ $t('服务节点') }}
        </div>
        <div v-for="dataCenter in dataCenters" :key="dataCenter.id" class="row  item-row">

          <div class="col-auto item-title text-bold">
            {{ locale === 'zh' ? dataCenter.name : dataCenter.name_en }}
          </div>

          <div class="col">
            <div class="row items-center q-pb-sm"
                 v-for="service in dataCenter.services.map(id => $store.state.fed.tables.serviceTable.byId[id])"
                 :key="service.id">

              <q-radio class="col-auto" dense v-model="radioService" :val="service.id"
                       :label=" locale === 'zh' ? service.name : service.name_en" :key="service.id"/>

            </div>

          </div>

        </div>
      </div>

      <div class="col section">
        <div class="text-h7 text-primary section-title">
          {{ $t('云主机配额') }}
        </div>

        <div class="row item-row">
          <div class="col-1  text-bold">
            {{ $t('可用配额') }}
          </div>
          <div class="col">
            <div v-if="quotasUsable.length === 0" class="row items-center">
              {{ $t('暂无可用云主机配额，请选择其它服务节点。 或') }}
              <q-btn v-if="isGroup" flat padding="none" color="primary"
                     :to="`/my/group/quota/apply?group=${radioGroup}&service=${radioService}`">
                {{ $t('申请项目组主机配额') }}
              </q-btn>
              <q-btn v-else flat padding="none" color="primary"
                     :to="`/my/personal/quota/apply?service=${radioService}`">
                {{ $t('申请个人云主机配额') }}
              </q-btn>
            </div>

            <div v-else>
              <q-radio v-for="quota in quotasUsable"
                       dense v-model="radioQuota" :val="quota.id" :key="quota.id" class="radio"
                       :disable="quota.expired || quota.exhausted">
                <quota-detail-card-intense :quota="quota" :is-group="isGroup"/>
              </q-radio>
            </div>
          </div>
        </div>

        <!--        <q-separator spaced="lg"/>-->

        <div class="row item-row">
          <div class="col-1  text-bold">
            {{ $t('不可用配额') }}
          </div>
          <div class="col">
            <div v-if="quotasUnusable.length === 0">{{ $t('无') }}</div>
            <div v-else>
              <div class="row">
                <q-btn class="q-pa-none" color="primary" flat dense padding="none" size="md" @click="isFolded=!isFolded">
                  {{ isFolded ? $t('展开') : $t('折叠') }}
                </q-btn>
              </div>
              <div v-if="!isFolded">
                <q-radio v-for="quota in quotasUnusable" dense v-model="radioQuota" :val="quota.id"
                         :key="quota.id" class="radio"
                         :disable="quota.expired || quota.exhausted">
                  <quota-detail-card-intense :quota="quota" :is-group="isGroup"/>
                </q-radio>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col section">

        <div class="text-h7 text-primary section-title">
          {{ $t('网络类型') }}
        </div>

        <div v-if="privateNetworks.length > 0" class="row item-row">
          <div class="col-1 text-bold">
            {{ $t('私网IP段') }}
          </div>
          <div class="col">
            <q-radio v-for="network in privateNetworks" dense v-model="radioNetwork" :val="network.id"
                     :label="network.name" :key="network.id" class="radio"/>
          </div>
        </div>

        <div v-if="publicNetworks.length > 0" class="row item-row">
          <div class="col-1 text-bold">
            {{ $t('公网IP段') }}
          </div>
          <div class="col">
            <q-radio v-for="network in publicNetworks" dense v-model="radioNetwork" :val="network.id"
                     :label="network.name" :key="network.id" class="radio"/>
          </div>
        </div>

        <div v-if="publicNetworks.length === 0 && privateNetworks.length === 0" class="row item-row">
          <div class="col-shrink item-title">
            {{ $t('暂无可用网络类型，请选择其它服务节点') }}
          </div>
        </div>
      </div>

      <div class="col section">
        <div class="text-h7 text-primary section-title">
          {{ $t('系统镜像') }}
        </div>
        <div v-if="images.length > 0" class="row item-row">
          <div class="col">
            <q-radio v-for="image in images" dense v-model="radioImage" :val="image.id"
                     :label="image.name" :key="image.id" class="radio"/>
          </div>
        </div>
        <div v-else>{{ $t('暂无可用镜像，请选择其它服务节点') }}</div>
      </div>

      <div class="col section">
        <div class="text-h7 text-primary section-title">
          CPU/{{ $t('内存') }}
        </div>
        <div v-if="flavors.length > 0" class="row item-row">
          <div class="col">
            <q-radio v-for="flavor in flavors" dense v-model="radioFlavor" :val="flavor.id"
                     :label="`${flavor.vcpus}${$t('核')}/${flavor.ram/1024}GB`" :key="flavor.id" class="radio"/>
          </div>
        </div>
        <div v-else>{{ $t('暂无可用配置，请选择其它服务节点') }}</div>
      </div>

      <div class="col section">
        <div class="text-h7 text-primary section-title">
          {{ $t('备注') }}
        </div>
        <div class="row item-row">
          <div class="col-6">
            <q-input ref="input" class="input-remarks" v-model="inputRemarks" maxlength="30" dense outlined counter/>
          </div>
        </div>
      </div>

      <div class="col summarize-section">
        <div class="text-h7 text-primary section-title">
          {{ $t('所选配置') }}
        </div>

        <div v-if="isGroup" class="row item-row">
          <div class="col-shrink item-title-narrow text-grey">
            {{ $t('项目组') }}
          </div>
          <div class="col">
            <div v-if="radioGroup !== ''">
              {{ $store.state.account.tables.groupTable.byId[radioGroup]?.name }}
            </div>
            <div v-else class="text-red">{{ $t('请选择项目组') }}</div>
          </div>
        </div>

        <div class="row item-row">
          <div class="col-shrink item-title-narrow text-grey">
            {{ $t('服务节点') }}
          </div>
          <div class="col">
            <div
              v-if="$store.state.fed.tables.dataCenterTable.byId[radioDataCenter] && $store.state.fed.tables.serviceTable.byId[radioService]">
              {{
                locale === 'zh' ?
                  `${$store.state.fed.tables.dataCenterTable.byId[radioDataCenter].name} - ${$store.state.fed.tables.serviceTable.byId[radioService].name}` :
                  `${$store.state.fed.tables.dataCenterTable.byId[radioDataCenter].name_en} - ${$store.state.fed.tables.serviceTable.byId[radioService].name_en}`
              }}
            </div>
            <div v-else class="text-red">{{ $t('请选择服务节点') }}</div>
          </div>
        </div>

        <div class="row item-row">
          <div class="col-shrink item-title-narrow text-grey">
            {{ $t('云主机配额') }}
          </div>
          <div v-if="isGroup" class="col">
            <div v-if="$store.state.server.tables.groupQuotaTable.byId[radioQuota]?.display">
              {{ $store.state.server.tables.groupQuotaTable.byId[radioQuota]?.display }}
            </div>
            <div v-else class="text-red">{{ $t('请选择云主机配额') }}</div>
          </div>
          <div v-else class="col">
            <div v-if="$store.state.server.tables.personalQuotaTable.byId[radioQuota]?.display">
              {{ $store.state.server.tables.personalQuotaTable.byId[radioQuota]?.display }}
            </div>
            <div v-else class="text-red">{{ $t('请选择云主机配额') }}</div>
          </div>
        </div>

        <div class="row item-row">
          <div class="col-shrink item-title-narrow text-grey">
            {{ $t('网络类型') }}
          </div>
          <div class="col">
            <div
              v-if="$store.state.server.tables.serviceNetworkTable.byLocalId[`${radioService}-${radioNetwork}`]?.name">
              {{ $store.state.server.tables.serviceNetworkTable.byLocalId[`${radioService}-${radioNetwork}`]?.name }}
            </div>
            <div v-else class="text-red">{{ $t('请选择网络类型') }}</div>
          </div>
        </div>

        <div class="row item-row">
          <div class="col-shrink item-title-narrow text-grey">
            {{ $t('系统镜像') }}
          </div>
          <div class="col">
            <div v-if="$store.state.server.tables.serviceImageTable.byLocalId[`${radioService}-${radioImage}`]?.name">
              {{ $store.state.server.tables.serviceImageTable.byLocalId[`${radioService}-${radioImage}`]?.name }}
            </div>
            <div v-else class="text-red">{{ $t('请选择系统镜像') }}</div>
          </div>
        </div>

        <div class="row item-row">
          <div class="col-shrink item-title-narrow text-grey">
            CPU/{{ $t('内存') }}
          </div>
          <div class="col ">
            <div v-if="$store.state.server.tables.fedFlavorTable.byId[radioFlavor]">
              {{
                `${$store.state.server.tables.fedFlavorTable.byId[radioFlavor].vcpus}核/${$store.state.server.tables.fedFlavorTable.byId[radioFlavor].ram / 1024}GB`
              }}
            </div>
            <div v-else class="text-red">{{ $t('请选择配置') }}</div>
          </div>
        </div>

        <div class="row item-row">
          <div class="col-shrink item-title-narrow text-grey">
            {{ $t('备注') }}
          </div>
          <div v-if="inputRemarks" class="col">
            {{ inputRemarks }}
          </div>
          <div v-else class="text-red">{{ $t('请填写备注') }}</div>
        </div>

      </div>

      <q-btn color="primary q-mb-xl" @click="deployServer" unelevated :loading="isDeploying">
        {{ $t('新建云主机') }}
      </q-btn>

    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'
import { Notify } from 'quasar'

import QuotaDetailCardIntense from 'components/Quota/QuotaDetailCardDense.vue'
import { useRouter } from 'vue-router'
import api from 'src/store/api'

export default defineComponent({
  name: 'ServerDeployCard',
  components: { QuotaDetailCardIntense },
  props: {
    isGroup: {
      type: Boolean,
      required: true
    },
    groupId: {
      type: String,
      required: false
    },
    serviceId: {
      type: String,
      required: false
    },
    quotaId: {
      type: String,
      required: false
    }
  },
  setup (props) {
    const $store = useStore<StateInterface>()
    const $router = useRouter()
    const { locale } = useI18n({ useScope: 'global' })

    // 不可用配额是否折叠
    const isFolded = ref(true)

    // dom元素
    const input = ref<HTMLElement>()

    // radio选项数据
    // // 全局数据
    // owner/leader权限才能建立云主机， member不能建立
    const groups = computed(() => $store.getters['account/getGroupsByMyRole'](['owner', 'leader']))
    const dataCenters = computed(() => Object.values($store.state.fed.tables.dataCenterTable.byId))
    const services = computed(() => Object.values($store.state.fed.tables.serviceTable.byId))
    const flavors = computed(() => Object.values($store.state.server.tables.fedFlavorTable.byId))
    // radioService的选项数据根据dataCenters动态生成,此处没有
    // //依赖radioService Id选择值的数据
    const publicNetworks = computed(() => $store.getters['server/getPublicNetworksByServiceId'](radioService.value))
    const privateNetworks = computed(() => $store.getters['server/getPrivateNetworksByServicedId'](radioService.value))
    const images = computed(() => $store.getters['server/getImagesByServiceId'](radioService.value))
    const quotasValid = computed(() => props.isGroup ? $store.getters['server/getGroupValidQuotasByServiceId'](radioService.value, radioGroup.value) : $store.getters['server/getPersonalValidQuotasByServiceId'](radioService.value))
    const quotasInvalid = computed(() => props.isGroup ? $store.getters['server/getGroupInvalidQuotasByServiceId'](radioService.value, radioGroup.value) : $store.getters['server/getPersonalInvalidQuotasByServiceId'](radioService.value))

    // radio选项 初始状态 (1)
    const radioGroup = ref('')
    const radioService = ref('')
    const radioDataCenter = computed(() => $store.state.fed.tables.serviceTable.byId[radioService.value]?.data_center || '')
    const radioQuota = ref('')
    const radioNetwork = ref('')
    const radioImage = ref('')
    const radioFlavor = ref('')
    const inputRemarks = ref('')

    /* table 进入页面过程中选择默认项 */
    // radio默认选择 (2)
    const chooseRadioDefaults = () => {
      if (props.quotaId) {
        // quota使用指定id
        radioQuota.value = props.quotaId
        // group和service用quota的归属信息算出来
        radioGroup.value = $store.state.server.tables.groupQuotaTable.byId[props.quotaId]?.vo_id as string
        radioService.value = props.isGroup ? $store.state.server.tables.groupQuotaTable.byId[props.quotaId]?.service : $store.state.server.tables.personalQuotaTable.byId[props.quotaId]?.service
      } else {
        radioGroup.value = props.groupId || groups.value[0]?.id || ''
        radioService.value = props.serviceId || services.value[0]?.id || ''
        radioQuota.value = quotasValid.value[0]?.id || ''
      }
      // network image flavor 总是默认选第一项
      radioNetwork.value = privateNetworks.value.length > 0 ? privateNetworks.value[0]?.id : publicNetworks.value[0]?.id
      radioImage.value = images.value[0]?.id
      radioFlavor.value = flavors.value[0]?.id
    }
    // setup时调用一次 (3) table已加载时进入页面要选一次默认值
    chooseRadioDefaults()
    // 根据table的变化情况再调用 (4) table未加载时进入页面，每变化一次都要选一次默认值
    watch([$store.state.server.tables, $store.state.account.tables.groupTable, $store.state.account.tables.groupMemberTable], chooseRadioDefaults)
    /* table 进入页面过程中选择默认项 */

    /* 在table都加载后，4个radio，随着group/service变化选择默认项 */
    watch([radioGroup, radioService], () => {
      // 在group/service变化后, network image flavor 总是默认选第一项
      radioQuota.value = quotasValid.value[0]?.id
      radioNetwork.value = privateNetworks.value.length > 0 ? privateNetworks.value[0]?.id : publicNetworks.value[0]?.id
      radioImage.value = images.value[0]?.id
      radioFlavor.value = flavors.value[0]?.id
      // 切换group/service时，不可用quota也恢复折叠
      isFolded.value = true
    })
    /* 在table都加载后，4个radio，随着group/service变化选择默认项 */

    /* 新建云主机 */
    const isDeploying = ref(false)
    const deployServer = async () => {
      // 如果radio没有选择全，则弹出通知
      if (!radioService.value || !radioNetwork.value || !radioImage.value || !radioFlavor.value || !radioQuota.value) {
        Notify.create({
          classes: 'notification-negative shadow-15',
          icon: 'error',
          textColor: 'negative',
          message: '请选择正确的云主机配置',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      } else if (!inputRemarks.value) {
        Notify.create({
          classes: 'notification-negative shadow-15',
          icon: 'error',
          textColor: 'negative',
          message: '请填写备注',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
        input.value?.focus()
      } else {
        isDeploying.value = true
        const selection = {
          service_id: radioService.value,
          network_id: radioNetwork.value,
          image_id: radioImage.value,
          flavor_id: radioFlavor.value,
          quota_id: radioQuota.value,
          remarks: inputRemarks.value
        }
        const respPostServer = await api.server.postServer({ body: selection })
        if (respPostServer.status === 201) {
          // 更新userServerTable,根据返回的serverId获取该server的全部信息，存入table
          void await $store.dispatch('server/loadSingleServer', {
            serverId: respPostServer.data.id,
            isGroup: props.isGroup
          })
          // notify
          Notify.create({
            classes: 'notification-positive shadow-15',
            icon: 'check_circle',
            textColor: 'positive',
            message: `成功新建云主机: ${props.isGroup ? $store.state.server.tables.groupServerTable.byId[respPostServer.data.id].ipv4 : $store.state.server.tables.personalServerTable.byId[respPostServer.data.id].ipv4}`,
            position: 'bottom',
            closeBtn: true,
            timeout: 15000,
            multiLine: false
          })
          // 改变按钮状态
          isDeploying.value = false
          // 跳转
          void $router.push({ path: props.isGroup ? '/my/group/server' : '/my/personal/server' })
        } else if (respPostServer.status === 202) {
          // notify
          Notify.create({
            classes: 'notification-positive shadow-15',
            icon: 'check_circle',
            textColor: 'positive',
            message: '云主机新建中，请稍候...',
            position: 'bottom',
            closeBtn: true,
            timeout: 15000,
            multiLine: false
          })
          // 改变按钮状态
          isDeploying.value = false
          // 跳转
          void $router.push({ path: props.isGroup ? '/my/group/server' : '/my/personal/server' })
        } else {
          // notify 使用axios统一报错
          // 改变按钮状态
          isDeploying.value = false
        }
      }
    }
    /* 新建云主机 */

    return {
      input,
      locale,
      groups,
      dataCenters,
      flavors,
      publicNetworks,
      privateNetworks,
      images,
      quotasUsable: quotasValid,
      quotasUnusable: quotasInvalid,
      radioService,
      radioGroup,
      radioDataCenter,
      radioNetwork,
      radioImage,
      radioFlavor,
      radioQuota,
      inputRemarks,
      isFolded,
      isDeploying,
      deployServer
    }
  }
})
</script>

<style lang="scss" scoped>
.ServerDeployCard {
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

.summarize-section {
  margin-bottom: 30px;
  padding: 10px 20px;
  border: 1.5px solid $primary;
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
  margin-bottom: 5px;
  padding: 0 10px;
}
</style>
