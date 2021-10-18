<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onHideClick">
    <q-card class="q-dialog-plugin dialog-primary ">

      <q-card-section class="row items-center justify-center q-pb-md">
        <div class="text-primary">{{ action === 'delete' ? $t('删除云主机') : $t('强制删除云主机') }}</div>
        <q-space/>
        <q-btn icon="close" flat dense size="sm" v-close-popup/>
      </q-card-section>

      <q-separator/>

      <q-card-section class="q-pt-lg">

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
            系统镜像
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

        <div class="row q-pb-lg items-center">
          <div class="col-2 text-grey-7">
            可用期
          </div>
          <div class="col">
            {{ new Date(server.creation_time).toLocaleString(locale) }} -
            {{ server.expiration_time ? new Date(server.expiration_time).toLocaleString(locale) : '永久有效' }}
          </div>
        </div>

        <div class="row q-pb-lg items-center">
          <div class="col-2 text-grey-7">
            删除锁定
          </div>
          <div class="col">
            <q-toggle
              ref="toggle_btn"
              v-model="toggle"
              checked-icon="lock"
              unchecked-icon="lock_open"
              color="light-green"
              size="lg"
              @click=" $store.dispatch('server/toggleDeleteLock', {isGroup:isGroup, serverId: serverId})"
            >
              <q-tooltip v-if="server.lock === 'free'">
                {{ $t('未锁定云主机删除操作') }}
              </q-tooltip>
              <q-tooltip v-else>
                {{ $t('已锁定云主机删除操作') }}
              </q-tooltip>
            </q-toggle>
          </div>
        </div>

        <div class="text-primary"> 被删除的云主机将无法自行恢复，确认删除？</div>
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn color="primary" :label="$t('取消')" @click="onCancelClick"/>
        <q-btn color="primary" :label="$t('确认')" @click="onOKClick"/>
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
      toggle_btn
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
