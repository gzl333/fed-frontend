<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin dialog-primary">
      <!--
        ...content
        ... use q-card-section for it?
      -->
      <q-card-section class="row items-center justify-center q-pb-md">
        <div class="text-primary">{{ $t('修改配额申请') }}</div>
        <q-space/>
        <q-btn icon="close" flat dense size="sm" v-close-popup/>
      </q-card-section>

      <q-separator/>

      <q-card-section class="q-pt-lg">

        <div v-if="isGroup" class="row q-pb-lg">
          <div class="col-2 text-grey-7">
            项目组
            <q-icon name="help_outline" color="grey" size="xs">
              <q-tooltip>{{ $t('如需修改项目组，请提交新的申请') }}</q-tooltip>
            </q-icon>
          </div>
          <div class="col">
            {{ $store.state.account.tables.groupTable.byId[currentApplication.vo_id].name }}
          </div>
        </div>

        <div class="row q-pb-lg">
          <div class="col-2 text-grey-7">
            服务节点
            <q-icon name="help_outline" color="grey" size="xs">
              <q-tooltip>{{ $t('如需修改服务节点，请提交新的申请') }}</q-tooltip>
            </q-icon>
          </div>
          <div class="col">
            {{
              $store.state.fed.tables.dataCenterTable.byId[$store.state.fed.tables.serviceTable.byId[currentApplication.service].data_center].name
            }}
            - {{ $store.state.fed.tables.serviceTable.byId[currentApplication.service].name }}
          </div>
        </div>

        <div class="row q-pb-md">
          <div class="col-2 text-grey-7 q-pt-sm">资源有效期</div>
          <div class="col">
            <q-slider
              v-model="newApplication.duration_days"
              :min="1"
              :max="365"
              :step="1"
              label
              :label-value="newApplication.duration_days + '天'"
              label-always
              color="primary"
            />
          </div>
        </div>

        <div class="row q-pb-md">
          <div class="col-2 text-grey-7 q-pt-sm">CPU</div>
          <div class="col">
            <q-slider
              v-model="newApplication.vcpu"
              :min="1"
              :max="16"
              :step="1"
              label
              :label-value="newApplication.vcpu + '核'"
              label-always
              color="primary"
            />
          </div>
        </div>

        <div class="row q-pb-md">
          <div class="col-2 text-grey-7 q-pt-sm">内存</div>
          <div class="col">
            <q-slider
              v-model="newApplication.ram"
              :min="1024"
              :max="32768"
              :step="1024"
              label
              :label-value="newApplication.ram/1024 + 'GB'"
              label-always
              color="primary"
            />
          </div>
        </div>

        <div class="row q-pb-md">
          <div class="col-2 text-grey-7 q-pt-sm">私网IP</div>
          <div class="col">
            <q-slider
              v-model="newApplication.private_ip"
              :min="0"
              :max="10"
              :step="1"
              label
              :label-value="newApplication.private_ip + '个'"
              label-always
              color="primary"
            />
          </div>
        </div>

        <div class="row q-pb-md">
          <div class="col-2 text-grey-7 q-pt-sm">公网IP</div>
          <div class="col">
            <q-slider
              v-model="newApplication.public_ip"
              :min="0"
              :max="10"
              :step="1"
              label
              :label-value="newApplication.public_ip + '个'"
              label-always
              color="primary"
            />
          </div>
        </div>

        <div class="row q-pb-md">
          <div class="col-2 text-grey-7 q-pt-sm">云硬盘</div>
          <div class="col">
            <q-slider
              v-model="newApplication.disk_size"
              :min="0"
              :max="1024"
              :step="128"
              label
              :label-value="newApplication.disk_size + 'GB'"
              label-always
              color="primary"
            />
          </div>
        </div>

        <div class="row items-center q-pb-md">
          <div class="col-2 text-grey-7 q-pb-md">配额用途</div>
          <div class="col">
            <q-input ref="input" v-model="newApplication.purpose" maxlength="30" outlined dense counter/>
          </div>
        </div>

      </q-card-section>

      <!--      <q-separator/>-->

      <!-- buttons example -->
      <q-card-actions align="between">
        <q-btn color="primary" unelevated @click="onCancelClick">
          {{ $t('放弃') }}
        </q-btn>
        <q-btn color="primary" outline @click="onOKClick">
          {{ $t('确认') }}
        </q-btn>
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { Notify, useDialogPluginComponent } from 'quasar'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'QuotaApplicationEditCard',
  components: {},
  props: {
    applyId: {
      type: String,
      required: true
    },
    isGroup: {
      type: String,
      required: false
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

    // input
    const input = ref<HTMLElement>()

    // radio 设计模式：创建一个reactive响应式对象，初始值来自另一个computed响应式对象
    const currentApplication = computed(() => props.isGroup ? $store.state.server.tables.groupQuotaApplicationTable.byId[props.applyId] : $store.state.server.tables.personalQuotaApplicationTable.byId[props.applyId])
    const newApplication = reactive({
      service_id: currentApplication.value.service,
      duration_days: currentApplication.value.duration_days,
      vcpu: currentApplication.value.vcpu,
      ram: currentApplication.value.ram,
      private_ip: currentApplication.value.private_ip,
      public_ip: currentApplication.value.public_ip,
      disk_size: currentApplication.value.disk_size,
      company: currentApplication.value.company,
      contact: currentApplication.value.contact,
      purpose: currentApplication.value.purpose
    })

    // 点击ok的事件函数,在本地检查数据可靠性，然后传给action
    const onOKClick = () => {
      // 检查数据
      if (newApplication.public_ip === 0 && newApplication.private_ip === 0) {
        Notify.create({
          classes: 'notification-negative shadow-15',
          icon: 'mdi-alert',
          textColor: 'negative',
          message: '请至少选择1个私网或公网IP地址',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      } else if (newApplication.purpose === '') {
        Notify.create({
          classes: 'notification-negative shadow-15',
          icon: 'mdi-alert',
          textColor: 'negative',
          message: '请填写配额用途',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
        // focus
        input.value?.focus()
      } else {
        // payload是传给onOK的实参, data从这里传到action里面
        onDialogOK({
          data: newApplication
        })
      }
    }

    return {
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,
      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick,
      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
      // 以上为dialog模板必须

      input,
      locale,
      newApplication,
      currentApplication
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
