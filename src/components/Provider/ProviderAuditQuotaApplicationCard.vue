<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin dialog-primary">
      <!--
        ...content
        ... use q-card-section for it?
      -->
      <q-card-section class="row items-center justify-center q-pb-md">
        <div class="text-primary">配额审批</div>
        <q-space/>
        <q-btn icon="close" flat dense size="sm" v-close-popup/>
      </q-card-section>

      <q-separator/>

      <q-card-section>
        <div class="row q-py-sm">
          <div class="col-3 text-grey-7">申请时间</div>
          <div class="col">{{ new Date(currentApplication.creation_time).toLocaleString(locale) }}</div>
        </div>

        <div class="row q-py-sm">
          <div class="col-3 text-grey-7">服务节点</div>
          <div class="col">
            {{
              $store.state.vm.tables.globalDataCenterTable.byId[$store.state.vm.tables.globalServiceTable.byId[currentApplication.service].data_center].name
            }}
            - {{ $store.state.vm.tables.globalServiceTable.byId[currentApplication.service].name }}
          </div>
        </div>

        <div class="row q-py-sm">
          <div class="col-3 text-grey-7">云主机时长</div>
          <div class="col">{{ currentApplication.duration_days }}天</div>
        </div>

        <div class="row q-py-sm">
          <div class="col-3 text-grey-7">CPU</div>
          <div class="col">{{ currentApplication.vcpu }}核</div>
        </div>

        <div class="row q-py-sm">
          <div class="col-3 text-grey-7">内存</div>
          <div class="col">{{ currentApplication.ram / 1024 }}GB</div>
        </div>

        <div class="row q-py-sm">
          <div class="col-3 text-grey-7">私网IP</div>
          <div class="col">{{ currentApplication.private_ip }}个</div>
        </div>

        <div class="row q-py-sm">
          <div class="col-3 text-grey-7">公网IP</div>
          <div class="col">{{ currentApplication.public_ip }}个</div>
        </div>

        <div class="row q-py-sm">
          <div class="col-3 text-grey-7">云硬盘</div>
          <div class="col">{{ currentApplication.disk_size }}GB</div>
        </div>

        <div class="row q-py-sm">
          <div class="col-3 text-grey-7">配额类型</div>
          <div class="col">{{ currentApplication.classification === 'vo' ? $t('项目组配额') : $t('个人配额') }}</div>
        </div>

        <div class="row q-py-sm">
          <div class="col-3 text-grey-7">用途</div>
          <div class="col">{{ currentApplication.purpose }}</div>
        </div>

        <div class="row q-py-sm">
          <div class="col-3 text-grey-7">申请人</div>
          <div class="col-auto">
            <div>{{ currentApplication.contact }}</div>
          </div>
          <q-btn class="col-shrink q-px-xs q-ma-none" flat dense icon="content_copy" size="xs" color="primary"
                 @click="clickToCopy(currentApplication.contact)">
            <q-tooltip>
              {{ $t('复制到剪切板') }}
            </q-tooltip>
          </q-btn>
        </div>

        <div class="row q-py-sm">
          <div class="col-3 text-grey-7">工作单位</div>
          <div class="col">
            <div>{{ currentApplication.company }}</div>
          </div>
        </div>

      </q-card-section>

      <!--      <q-separator/>-->

      <q-card-actions class="q-pa-md" align="between">

        <div class="row">
          <q-btn color="negative" unelevated icon="close" @click="onReject">
            {{ $t('拒绝') }}
          </q-btn>
          <q-input ref="input" class="q-px-sm" color="negative" outlined v-model="reason" :label="$t('拒绝原因')"
                   stack-label dense/>
        </div>

        <q-btn color="positive" unelevated icon="check" @click="onApprove">
          {{ $t('批准') }}
        </q-btn>
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { Notify, useDialogPluginComponent } from 'quasar'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import useCopyToClipboard from 'src/hooks/useCopyToClipboard'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'ProviderAuditQuotaApplicationCard',
  components: {},
  props: {
    applyId: {
      type: String,
      required: true
    }
  },
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits
  ],
  setup (props) {
    // REQUIRED; must be called inside of setup()
    const {
      dialogRef,
      onDialogHide,
      onDialogOK,
      onDialogCancel
    } = useDialogPluginComponent()

    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    const currentApplication = computed(() => $store.state.applyQuota.tables.adminQuotaApplicationTable.byId[props.applyId])
    // input
    const input = ref<HTMLElement>()
    // 拒绝的原因
    const reason = ref('')

    const onApprove = () => {
      onDialogOK({
        isApprove: true
      })
    }
    const onReject = () => {
      // reason不可为空
      if (reason.value === '') {
        // notify
        Notify.create({
          classes: 'notification-negative shadow-15',
          icon: 'mdi-alert',
          textColor: 'negative',
          message: '请填写拒绝原因',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
        // focus
        input.value?.focus()
      } else {
        onDialogOK({
          isApprove: false,
          reason: reason.value
        })
      }
    }

    // 复制信息到剪切板
    const clickToCopy = useCopyToClipboard()

    return {
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,
      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      // onOKClick,
      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
      // 以上为dialog模板必须

      onApprove,
      onReject,
      currentApplication,
      reason,
      clickToCopy,
      locale,
      input
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
