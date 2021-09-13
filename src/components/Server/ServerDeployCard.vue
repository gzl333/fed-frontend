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
          <div class="col-auto">
            {{ $t('使用该云主机的项目组') }}
          </div>
          <q-select class="col-4" outlined v-model="radioGroup" dense
                    :options="groups" map-options emit-value option-label="name" option-value="id"/>
        </div>
      </div>

      <div class="col section">
        <div class="text-h7 text-primary section-title">
          服务节点
        </div>
        <div v-for="dataCenter in dataCenters" :key="dataCenter.id" class="row  item-row">

          <div class="col-auto item-title text-bold">
            {{ dataCenter.name }}
          </div>

          <div class="col item-radios">
            <div class="row items-center q-pb-sm"
                 v-for="service in dataCenter.globalServices.map(id => $store.state.vm.tables.globalServiceTable.byId[id])"
                 :key="service.id">

              <q-radio class="col-auto" dense v-model="radioService" :val="service.id"
                       :label=" locale === 'zh' ? service.name : service.name_en" :key="service.id"/>

            </div>

          </div>

        </div>
      </div>

      <div class="col section">
        <div class="text-h7 text-primary section-title">
          云主机配额
        </div>

        <div class="row item-row">
          <div class="col-1  text-bold">
            可用配额
          </div>
          <div class="col item-radios">
            <div v-if="quotasUsable.length === 0" class="row items-center">
              暂无可用云主机配额，请选择其它服务节点。 或
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
              <q-radio v-for="quota in quotasUsable" dense v-model="radioQuota" :val="quota.id"
                       :key="quota.id" class="radio"
                       :disable="quota.expired || quota.exhausted">
                <quota-detail-card-intense :quota="quota" :is-group="isGroup"/>
              </q-radio>
            </div>
          </div>
        </div>

        <!--        <q-separator spaced="lg"/>-->

        <div class="row item-row">
          <div class="col-1  text-bold">
            不可用配额
          </div>
          <div class="col item-radios">
            <div v-if="quotasUnusable.length === 0">{{ $t('无') }}</div>
            <div v-else>
              <div class="row">
                <q-btn outline color="primary" dense padding="xss" size="xs" @click="isFolded=!isFolded">
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
          网络类型
        </div>
        <div v-if="privateNetworks.length > 0" class="row item-row">
          <div class="col-1 text-bold">
            私网IP
          </div>
          <div class="col item-radios">
            <q-radio v-for="network in privateNetworks" dense v-model="radioNetwork" :val="network.id"
                     :label="network.name" :key="network.id" class="radio"/>
          </div>
        </div>
        <div v-if="publicNetworks.length > 0" class="row item-row">
          <div class="col-1 text-bold">
            公网IP
          </div>
          <div class="col item-radios">
            <q-radio v-for="network in publicNetworks" dense v-model="radioNetwork" :val="network.id"
                     :label="network.name" :key="network.id" class="radio"/>
          </div>
        </div>
        <div v-if="publicNetworks.length === 0 && privateNetworks.length === 0" class="row item-row">
          <div class="col-shrink item-title">
            暂无可用网络类型，请选择其它服务节点
          </div>
        </div>
      </div>

      <div class="col section">
        <div class="text-h7 text-primary section-title">
          系统镜像
        </div>
        <div v-if="images.length > 0" class="row item-row">
          <div class="col item-radios">
            <q-radio v-for="image in images" dense v-model="radioImage" :val="image.id"
                     :label="image.name" :key="image.id" class="radio"/>
          </div>
        </div>
        <div v-else>暂无可用镜像，请选择其它服务节点</div>
      </div>

      <div class="col section">
        <div class="text-h7 text-primary section-title">
          CPU/内存
        </div>
        <div v-if="flavors.length > 0" class="row item-row">
          <div class="col item-radios">
            <q-radio v-for="flavor in flavors" dense v-model="radioFlavor" :val="flavor.id"
                     :label="`${flavor.vcpus}核/${flavor.ram/1024}GB`" :key="flavor.id" class="radio"/>
          </div>
        </div>
        <div v-else>暂无可用配置，请选择其它服务节点</div>
      </div>

      <div class="col section">
        <div class="text-h7 text-primary section-title">
          备注(可选)
        </div>
        <div class="row item-row">
          <div class="col-6">
            <q-input class="input-remarks" v-model="inputRemarks" maxlength="30" dense counter></q-input>
          </div>
        </div>
      </div>

      <div class="col section">
        <div class="text-h7 text-primary section-title">
          所选配置
        </div>

        <div class="row item-row">
          <div class="col-shrink item-title-narrow text-grey">
            服务节点
          </div>
          <div class="col item-radios">
            <div
              v-if="$store.state.vm.tables.globalDataCenterTable.byId[radioDataCenter] && $store.state.vm.tables.globalServiceTable.byId[radioService]">
              {{
                `${$store.state.vm.tables.globalDataCenterTable.byId[radioDataCenter].name} - ${$store.state.vm.tables.globalServiceTable.byId[radioService].name}`
              }}
            </div>
            <div v-else class="text-red">请选择服务节点</div>
          </div>
        </div>

        <div class="row item-row">
          <div class="col-shrink item-title-narrow text-grey">
            云主机配额
          </div>
          <div v-if="isGroup" class="col item-radios">
            <div v-if="$store.state.vm.tables.groupQuotaTable.byId[radioQuota]?.display">
              {{ $store.state.vm.tables.groupQuotaTable.byId[radioQuota]?.display }}
            </div>
            <div v-else class="text-red">请选择云主机配额</div>
          </div>
          <div v-else class="col item-radios">
            <div v-if="$store.state.vm.tables.userQuotaTable.byId[radioQuota]?.display">
              {{ $store.state.vm.tables.userQuotaTable.byId[radioQuota]?.display }}
            </div>
            <div v-else class="text-red">请选择云主机配额</div>
          </div>
        </div>

        <div class="row item-row">
          <div class="col-shrink item-title-narrow text-grey">
            网络类型
          </div>
          <div class="col item-radios">
            <div v-if="$store.state.vm.tables.globalNetworkTable.byLocalId[`${radioService}-${radioNetwork}`]?.name">
              {{ $store.state.vm.tables.globalNetworkTable.byLocalId[`${radioService}-${radioNetwork}`]?.name }}
            </div>
            <div v-else class="text-red">请选择网络类型</div>
          </div>
        </div>

        <div class="row item-row">
          <div class="col-shrink item-title-narrow text-grey">
            系统镜像
          </div>
          <div class="col item-radios">
            <div v-if="$store.state.vm.tables.globalImageTable.byLocalId[`${radioService}-${radioImage}`]?.name">
              {{ $store.state.vm.tables.globalImageTable.byLocalId[`${radioService}-${radioImage}`]?.name }}
            </div>
            <div v-else class="text-red">选择系统镜像</div>
          </div>
        </div>

        <div class="row item-row">
          <div class="col-shrink item-title-narrow text-grey">
            CPU/内存
          </div>
          <div class="col item-radios">
            <div v-if="$store.state.vm.tables.globalFlavorTable.byId[radioFlavor]">
              {{
                `${$store.state.vm.tables.globalFlavorTable.byId[radioFlavor].vcpus}核/${$store.state.vm.tables.globalFlavorTable.byId[radioFlavor].ram / 1024}GB`
              }}
            </div>
            <div v-else class="text-red">请选择配置</div>
          </div>
        </div>

        <div class="row item-row">
          <div class="col-shrink item-title-narrow text-grey">
            备注
          </div>
          <div class="col item-radios">
            {{
              inputRemarks
            }}
          </div>
        </div>

      </div>

      <q-btn color="primary" @click="deployServer" label="创建云主机" unelevated :loading="isDeploying"/>

    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'
import { Notify } from 'quasar'

import QuotaDetailCardIntense from 'components/Quota/QuotaDetailCardIntense.vue'
import { useRouter } from 'vue-router'

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

    // radio选项数据
    // // 全局数据
    // owner/leader权限才能建立云主机， member不能建立
    const groups = computed(() => $store.getters['group/getGroupsByMyRole'](['owner', 'leader']))
    const dataCenters = computed(() => Object.values($store.state.vm.tables.globalDataCenterTable.byId))
    const services = computed(() => Object.values($store.state.vm.tables.globalServiceTable.byId))
    const flavors = computed(() => Object.values($store.state.vm.tables.globalFlavorTable.byId))
    // radioService的选项数据根据dataCenters动态生成,此处没有
    // //依赖radioService Id选择值的数据
    const publicNetworks = computed(() => $store.getters['vm/getPublicNetworksByServiceId'](radioService.value))
    const privateNetworks = computed(() => $store.getters['vm/getPrivateNetworksByServicedId'](radioService.value))
    const images = computed(() => $store.getters['vm/getImagesByServiceId'](radioService.value))
    const quotasValid = computed(() => props.isGroup ? $store.getters['vm/getGroupValidQuotasByServiceId'](radioService.value, radioGroup.value) : $store.getters['vm/getPersonalValidQuotasByServiceId'](radioService.value))
    const quotasInvalid = computed(() => props.isGroup ? $store.getters['vm/getGroupInvalidQuotasByServiceId'](radioService.value, radioGroup.value) : $store.getters['vm/getPersonalInvalidQuotasByServiceId'](radioService.value))

    // radio选项 初始状态 (1)
    const radioGroup = ref('')
    const radioService = ref('')
    const radioDataCenter = computed(() => $store.state.vm.tables.globalServiceTable.byId[radioService.value]?.data_center || '')
    const radioQuota = ref('')
    const radioNetwork = ref('')
    const radioImage = ref('')
    const radioFlavor = ref('')
    const inputRemarks = ref('')

    /* table 进入页面过程中选择默认项 */
    // radio默认选择 (2)
    const chooseRadioEntering = () => {
      if (props.quotaId) {
        // quota使用指定id
        radioQuota.value = props.quotaId
        // group和service用quota的归属信息算出来
        radioGroup.value = $store.state.vm.tables.groupQuotaTable.byId[props.quotaId]?.vo_id as string
        radioService.value = $store.state.vm.tables.groupQuotaTable.byId[props.quotaId]?.service
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
    chooseRadioEntering()
    // 根据table的变化情况再调用 (4) table未加载时进入页面，每变化一次都要选一次默认值
    watch([$store.state.vm.tables, $store.state.group.tables], chooseRadioEntering)
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

    /* 创建云主机 */
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
        try {
          const respPostServer = await $store.dispatch('vm/postServer', { body: selection })
          console.log(selection)
          if (respPostServer.status === 201) {
            // 更新userServerTable,根据返回的serverId获取该server的全部信息，存入table
            void await $store.dispatch('vm/updateUserServerTableSingleServer', respPostServer.data.id)
            // notify
            Notify.create({
              classes: 'notification-positive shadow-15',
              icon: 'check_circle',
              textColor: 'positive',
              message: `成功创建云主机: ${$store.state.vm.tables.userServerTable.byId[respPostServer.data.id].ipv4}`,
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
              message: '云主机创建中...',
              position: 'bottom',
              closeBtn: true,
              timeout: 15000,
              multiLine: false
            })
            // 改变按钮状态
            isDeploying.value = false
            // 跳转
            void $router.push({ path: props.isGroup ? '/my/group/server' : '/my/personal/server' })
          }
        } catch (error) {
          // notify
          Notify.create({
            classes: 'notification-negative shadow-15',
            icon: 'error',
            textColor: 'negative',
            message: '创建云主机失败，请重试。',
            caption: `${error.response.status as string}: ${error.response.data.message as string}`, // 应告诉ts取到的值为string
            position: 'bottom',
            closeBtn: true,
            timeout: 5000,
            multiLine: false
          })
          // 改变按钮状态
          isDeploying.value = false
        }
      }
    }
    /* 创建云主机 */

    return {
      $store,
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
