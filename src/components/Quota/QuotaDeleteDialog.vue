<template>

  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin dialog-negative ">

      <q-card-section class="row items-center justify-center q-pb-md">
        <div class="text-negative">{{ $t('删除云主机配额') }}</div>
        <q-space/>
        <q-btn icon="close" flat dense size="sm" v-close-popup/>
      </q-card-section>

      <q-separator/>

      <q-card-section>

        <!--        <div class="row q-pb-lg items-center">-->
        <!--          <div class="col-2 text-grey-7">-->
        <!--            IP地址-->
        <!--          </div>-->
        <!--          <div class="col">-->
        <!--            {{ quota }}-->
        <!--          </div>-->
        <!--        </div>-->
        <quota-detail-card-dense :quota="quota" :is-group="isGroup"/>

      </q-card-section>

      <q-separator/>

      <q-card-section>

        <div class="row items-center">
          <div class="col text-grey-7">
            请仔细阅读以下事项，并在确认后勾选：
          </div>
        </div>

        <q-checkbox style="margin-left: -10px;" v-model="check1" color="primary">
          <div :class="check1?'text-primary':'text-black'">
            {{ $t('我了解删除配额不会影响已经创建的关联云主机') }}
          </div>
        </q-checkbox>

        <q-checkbox style="margin-left: -10px;" v-model="check2" color="primary">
          <div :class="check2?'text-primary':'text-black'">
            {{ $t('我了解删除的配额将无法恢复') }}
          </div>
        </q-checkbox>

      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="between">
        <q-btn class="q-ma-sm" :color="!check1 || !check2 ? 'grey' : 'primary'"
               unelevated
               :disable="!check1 || !check2"
               :label="$t('确认')"
               @click="onOKClick"/>
        <q-btn class="q-ma-sm" color="primary" unelevated :label="$t('取消')" @click="onDialogCancel"/>
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import QuotaDetailCardDense from 'components/Quota/QuotaDetailCardDense.vue'

export default defineComponent({
  name: 'QuotaDeleteDialog',
  components: {
    QuotaDetailCardDense
  },
  props: {
    quotaId: {
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
    const quota = computed(() => props.isGroup ? $store.state.server.tables.groupQuotaTable.byId[props.quotaId] : $store.state.server.tables.personalQuotaTable.byId[props.quotaId])

    const check1 = ref(false)
    const check2 = ref(false)

    return {
      dialogRef,
      onDialogHide,
      onOKClick: onDialogOK,
      onDialogCancel,
      quota,
      check1,
      check2
    }
  }
})
</script>

<style lang="scss" scoped>
.QuotaDeleteDialog {
}
</style>
