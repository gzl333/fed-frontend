<template>
  <div class="QuotaStatusChip">

    <q-chip v-if="!application.status"
            style="width: 90px;" class="text-bold " outline :ripple="false" color="grey-5" clickable
            @click="$store.dispatch('server/loadSingleQuotaApplicationStatus', {isGroup, applicationId: application.id}) ">
      <div class="row items-center justify-center full-width">
        {{ $t('获取中') }}
        <q-icon name="refresh" size="xs"/>
      </div>
      <q-tooltip>{{ $t('刷新配额申请状态') }}</q-tooltip>
    </q-chip>

    <q-chip v-if="application.status === 'wait'"
            style="width: 90px;" class="text-bold" outline :ripple="false" color="black" clickable
            @click="$store.dispatch('server/loadSingleQuotaApplicationStatus', {isGroup, applicationId: application.id})">
      <div class="row items-center justify-center full-width">
        {{ $t('待审批') }}
        <q-icon name="refresh" size="xs"/>
      </div>
      <q-tooltip>{{ $t('刷新配额申请状态') }}</q-tooltip>
    </q-chip>

    <q-chip v-if="application.status === 'pending'"
            style="width: 90px;" class="text-bold" outline :ripple="false" color="primary" clickable
            @click="$store.dispatch('server/loadSingleQuotaApplicationStatus', {isGroup, applicationId: application.id})">
      <div class="row items-center justify-center full-width">
        {{ $t('审批中') }}
        <q-icon name="refresh" size="xs"/>
      </div>
      <q-tooltip>{{ $t('刷新配额申请状态') }}</q-tooltip>
    </q-chip>

    <q-chip v-if="application.status === 'pass'"
            style="width: 90px;" class="text-bold" outline :ripple="false" color="light-green">
      <div class="row items-center justify-center full-width">
        {{ $t('已通过') }}
      </div>
    </q-chip>

    <div v-if="application.status === 'reject'">
      <q-chip style="width: 90px;" class="text-bold" outline :ripple="false" color="red">
        <div class="row items-center justify-center full-width">
          {{ $t('已拒绝') }}
        </div>
        <q-icon name="help_outline" color="red" size="xs"/>
      </q-chip>
      <q-tooltip class="bg-grey-4 text-black" :offset="[0, 0]">
        <div>{{$t('拒绝原因: ')}}</div>
        <div style="max-width: 150px;">{{ application.result_desc }}</div>
      </q-tooltip>
    </div>

    <q-chip v-if="application.status === 'cancel'"
            style="width: 90px;" class="text-bold" outline :ripple="false" color="grey">
      <div class="row items-center justify-center full-width">
        {{ $t('已取消') }}
      </div>
    </q-chip>
  </div>

</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { QuotaApplicationInterface } from 'src/store/server/state'

export default defineComponent({
  name: 'QuotaStatusChip',
  components: {},
  props: {
    application: {
      type: Object as PropType<QuotaApplicationInterface>,
      required: true
    },
    isGroup: {
      type: Boolean,
      required: true
    }
  },
  setup () {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.QuotaStatusChip {
}
</style>
