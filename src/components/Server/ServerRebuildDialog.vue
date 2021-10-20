<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin dialog-primary ">

      <q-card-section class="row items-center justify-center q-pb-md">
        <div class="text-primary">{{ $t('重建云主机') }}</div>
        <q-space/>
        <q-btn icon="close" flat dense size="sm" v-close-popup/>
      </q-card-section>

      <q-separator/>

      <q-card-section>

        <div class="row q-pb-lg items-center">
          <div class="col-2 text-grey-7">
            IP地址
          </div>
          <div class="col">
            {{ server.ipv4 }}
          </div>
        </div>

        <div class="row q-pb-lg items-center">
          <div class="col-2 text-grey-7">
            备注
          </div>
          <div class="col">
            {{ server.remarks }}
          </div>
        </div>

        <div v-if="isGroup" class="row q-pb-lg items-center">
          <div class="col-2 text-grey-7">
            项目组
          </div>
          <div class="col">
            {{ $store.state.account.tables.groupTable.byId[server.vo_id].name }}
          </div>
        </div>

        <div class="row q-pb-lg items-center">
          <div class="col-2 text-grey-7">
            所属机构
          </div>
          <div class="col">
            {{
              $store.state.fed.tables.dataCenterTable.byId[$store.state.fed.tables.serviceTable.byId[server.service].data_center].name
            }}
          </div>
        </div>

        <div class="row q-pb-lg items-center">
          <div class="col-2 text-grey-7">
            服务节点
          </div>
          <div class="col">
            {{ $store.state.fed.tables.serviceTable.byId[server.service].name }}
          </div>
        </div>

        <div class="row q-pb-lg items-center">
          <div class="col-2 text-grey-7">
            配置
          </div>
          <div class="col">
            {{ server.vcpus }}核 / {{ server.ram / 1024 }}GB
          </div>
        </div>

        <div class="row q-pb-lg items-center">
          <div class="col-2 text-grey-7">
            IP类型
          </div>
          <div class="col">
            {{ server.public_ip ? '公网' : '私网' }}
          </div>
        </div>

        <div class="row q-pb-lg items-center">
          <div class="col-2 text-grey-7">
            可用期
          </div>
          <div class="col">
            {{ new Date(server.creation_time).toLocaleString(locale) }} -
            {{ server.expiration_time ? new Date(server.expiration_time).toLocaleString(locale) : '永久有效' }}
            <q-icon
              v-if="server.expiration_time !== null && (new Date(server.expiration_time).getTime() - new Date().getTime()) < 0"
              name="help_outline" color="red" size="xs">
              <q-tooltip>{{ $t('云主机已到期。如需继续使用该云主机，请立即与云联邦管理员联系。否则可能会被定期清除。') }}</q-tooltip>
            </q-icon>
          </div>
        </div>

        <div class="row items-center">
          <div class="col-2 text-grey-7">
            操作系统
          </div>
          <div class="col">
            {{ server.image }}
          </div>
        </div>

      </q-card-section>

      <q-separator/>

      <q-card-section>

        <div class="row q-pb-lg items-center">
          <div class="col-2 text-grey-7">
            目标操作系统
          </div>
          <div class="col-8">
            <q-select ref="selectDom" v-if="images.length !== 0" outlined v-model="select" dense
                      :options="images" map-options emit-value option-label="name" option-value="id"/>
          </div>
        </div>

        <div class="row items-center">
          <div class="col text-grey-7">
            请仔细阅读以下事项，并在确认后勾选：
          </div>
        </div>

        <q-checkbox style="margin-left: -10px;" v-model="check" color="primary">
          <div class="text-primary">
            {{ $t('我了解重建云主机会抹去全部数据，且无法恢复') }}
          </div>
        </q-checkbox>

      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="between">
        <q-btn class="q-ma-sm" color="primary" unelevated :label="$t('确认')" :disable="!check" @click="onOKClick"/>
        <q-btn class="q-ma-sm" color="primary" unelevated :label="$t('取消')" @click="onCancelClick"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { Notify, useDialogPluginComponent } from 'quasar'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'ServerRebuildDialog',
  components: {},
  props: {
    serverId: {
      type: String,
      required: true
    },
    isGroup: {
      type: Boolean,
      required: true
    }
  },
  emits: [
    ...useDialogPluginComponent.emits
  ],
  setup (props) {
    const {
      dialogRef,
      onDialogHide,
      onDialogOK,
      onDialogCancel
    } = useDialogPluginComponent()
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })
    const server = computed(() => props.isGroup ? $store.state.server.tables.groupServerTable.byId[props.serverId] : $store.state.server.tables.personalServerTable.byId[props.serverId])
    const images = computed(() => $store.getters['server/getImagesByServiceId'](server.value.service))

    const selectDom = ref<HTMLElement>()
    const select = ref(server.value.image_id)
    const check = ref(false)

    // 确定时
    const onOKClick = () => {
      if (select.value === '') {
        Notify.create({
          classes: 'notification-negative shadow-15',
          icon: 'mdi-alert',
          textColor: 'negative',
          message: '请选择目标操作系统',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
        selectDom.value?.focus()
      } else {
        onDialogOK(select.value)
      }
    }

    return {
      dialogRef,
      onDialogHide,
      onCancelClick: onDialogCancel,
      onOKClick,
      locale,
      server,
      images,
      select,
      selectDom,
      check
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
