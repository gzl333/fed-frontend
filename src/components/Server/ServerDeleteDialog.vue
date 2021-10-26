<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onHideClick">
    <q-card class="q-dialog-plugin dialog-primary ">

      <q-card-section class="row items-center justify-center q-pb-md">
        <div class="text-negative">{{ action === 'delete' ? $t('删除云主机') : $t('强制删除云主机') }}</div>
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
            操作系统
          </div>
          <div class="col">
            {{ server.image }}
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

        <div class="row  items-center">
          <div class="col-2 text-grey-7">
            可用期
          </div>
          <div class="col">
            {{ new Date(server.creation_time).toLocaleString(locale) }} -
            {{ server.expiration_time ? new Date(server.expiration_time).toLocaleString(locale) : '永久有效' }}
<!--            <q-icon-->
<!--              v-if="server.expiration_time !== null && (new Date(server.expiration_time).getTime() - new Date().getTime()) < 0"-->
<!--              name="help_outline" color="red" size="xs">-->
<!--              <q-tooltip>{{ $t('云主机已到期') }}</q-tooltip>-->
<!--            </q-icon>-->
          </div>
        </div>

      </q-card-section>

      <q-separator/>

      <q-card-section>
        <div class="row items-center">
          <div class="col text-grey-7">
            请仔细阅读以下事项，并在确认后勾选：
          </div>
        </div>

        <q-checkbox style="margin-left: -10px;" v-model="check1" color="primary">
          <div class="text-primary">
            {{ $t('我了解删除云主机会丢失全部数据，且无法自行恢复') }}
          </div>
        </q-checkbox>

        <q-checkbox style="margin-left: -10px;" v-model="check2" color="primary">
          <div class="text-primary">
            {{ $t('我了解已经消耗的云主机配额无法恢复') }}
          </div>
        </q-checkbox>

        <div class="row items-center">
          <div class="col text-grey-7">
            请解除锁定，并确认删除：
          </div>
        </div>

        <q-toggle
          style="margin-left: -12px;"
          ref="toggle_btn"
          :disable="!check1 || !check2"
          v-model="toggle"
          :label="toggle?$t('已锁定'):$t('已解除')"
          checked-icon="lock"
          unchecked-icon="lock_open"
          color="light-green"
          size="lg"
          @update:model-value=" $store.dispatch('server/toggleDeleteLock', {isGroup:isGroup, serverId: serverId})"
        >
          <q-tooltip v-if="server.lock === 'free'">
            {{ $t('未锁定云主机删除操作') }}
          </q-tooltip>
          <q-tooltip v-else>
            {{ $t('已锁定云主机删除操作') }}
          </q-tooltip>
        </q-toggle>

      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="between">
        <q-btn class="q-ma-sm" color="primary" unelevated :disable="toggle || !check1 || !check2" :label="$t('确认')" @click="onOKClick"/>
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
  name: 'ServerDeleteDialog',
  components: {},
  props: {
    action: {
      type: String,
      required: true
    },
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

    const keepServerDeleteLock = () => {
      if (server.value.lock === 'free') {
        // 把lock状态改为lock-delete
        void $store.dispatch('server/toggleDeleteLockToLock', {
          serverId: props.serverId,
          isGroup: props.isGroup
        })
      }
    }
    // 进入时检查lock状态
    keepServerDeleteLock()

    const check1 = ref(false)
    const check2 = ref(false)

    // lock toggle
    const toggle_btn = ref<HTMLElement>()
    const toggle = ref(computed(() => server.value.lock !== 'free'))

    // hide对话框时
    const onHideClick = () => {
      keepServerDeleteLock()
      onDialogHide()
    }
    // 取消时
    const onCancelClick = () => {
      keepServerDeleteLock()
      onDialogCancel()
    }
    // 确定时
    const onOKClick = () => {
      if (server.value.lock !== 'free') {
        Notify.create({
          classes: 'notification-negative shadow-15',
          icon: 'mdi-alert',
          textColor: 'negative',
          message: '请取消云主机的删除锁定',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
        // focus 未起作用
        // toggle_btn.value?.focus()
      } else {
        onDialogOK({})
      }
    }

    return {
      dialogRef,
      onHideClick,
      onOKClick,
      onCancelClick,
      locale,
      server,
      toggle,
      toggle_btn,
      check1,
      check2
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
