<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin dialog-primary">
      <!--
        ...content
        ... use q-card-section for it?
      -->
      <pre>{{ applyId }}</pre>
      <pre>{{ isGroup }}</pre>

      <q-card-section class="row items-center q-pa-sm q-pb-sm">
        <div class="text-h6">{{ $t('修改配额申请') }}</div>
        <q-space/>
        <q-btn icon="close" flat dense size="sm" v-close-popup/>
      </q-card-section>

      <q-separator/>

      <q-card-section>

        <!--        <div class="row q-py-lg">-->
        <!--          <div class="col-3 text-grey-7">服务节点</div>-->
        <!--          <div class="col">-->
        <!--            {{-->
        <!--              $store.state.vm.tables.globalDataCenterTable.byId[$store.state.vm.tables.globalServiceTable.byId[currentApplication.service].data_center].name-->
        <!--            }}-->
        <!--            - {{ $store.state.vm.tables.globalServiceTable.byId[currentApplication.service].name }}-->
        <!--          </div>-->
        <!--        </div>-->

        <div class="row q-pb-md">
          <div class="col-3 text-grey-7">资源有效期</div>
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
          <div class="col-3 text-grey-7">CPU</div>
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
          <div class="col-3 text-grey-7">内存</div>
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
          <div class="col-3 text-grey-7">私网IP</div>
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
          <div class="col-3 text-grey-7">公网IP</div>
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
          <div class="col-3 text-grey-7">云硬盘</div>
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

        <div class="row q-pb-md">
          <div class="col-3 text-grey-7">配额用途</div>
          <div class="col">
            <q-input v-model="newApplication.purpose" maxlength="30" dense counter/>
          </div>
        </div>

        <div class="row q-pb-md">
          <div class="col-3 text-grey-7">工作单位</div>
          <div class="col">
            <q-input v-model="newApplication.company" maxlength="20" dense counter/>
          </div>
        </div>

      </q-card-section>

      <q-separator/>

      <q-card-actions align="right">
        <q-btn v-close-popup unelevated color="primary" label="放弃"/>
        <q-btn v-close-popup outline color="primary" label="保存"/>
      </q-card-actions>
      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn color="primary" unelevated @click="onCancelClick">
          {{ $t('取消') }}
        </q-btn>
        <q-btn color="primary" outline @click="onOKClick">
          {{ $t('确定') }}
        </q-btn>
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from 'vue'
import { /* Notify, */ useDialogPluginComponent } from 'quasar'
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
      // onDialogOK,
      onDialogCancel
    } = useDialogPluginComponent()

    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // radio
    // todo
    const currentApplication = computed(() => props.isGroup ? $store.state.applyQuota.tables.groupQuotaApplicationTable.byId[props.applyId] : $store.state.applyQuota.tables.userQuotaApplicationTable.byId[props.applyId])
    const newApplication = reactive({
      service_id: '',
      duration_days: 0,
      vcpu: 0,
      ram: 0,
      private_ip: 0,
      public_ip: 0,
      disk_size: 0,
      company: '',
      contact: '',
      purpose: ''
    })
    // 当currentApplication从api取到新值时，更新newApplication
    watch(currentApplication, (currentApplication) => {
      Object.assign(newApplication, currentApplication)
      // 以下属性不匹配，单独处理
      newApplication.service_id = currentApplication.service
    })

    // 点击ok的事件函数
    // const onOKClick = () => {
    //   // 检查数据，空数组不发送请求
    //   // todo 正则检查email格式
    //   if (Object.values().length === 0) {
    //     Notify.create({
    //       classes: 'notification-negative shadow-15',
    //       icon: 'mdi-alert',
    //       textColor: 'negative',
    //       message: '请输入正确的科技云通行证账户',
    //       position: 'bottom',
    //       closeBtn: true,
    //       timeout: 5000,
    //       multiLine: false
    //     })
    //   } else {
    //     // payload是传给onOK的实参, data从这里传到action里面
    //     onDialogOK({
    //       groupId: props.applyId,
    //       usernames: Object.values()
    //     })
    //   }
    // }

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

      $store,
      locale,
      newApplication
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
