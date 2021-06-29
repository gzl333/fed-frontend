<template>
  <span class="ServerStatus">

    <q-chip v-if="!props.server.status"
            class="text-bold" outline ripple="false" color="grey-5" :label="$t('获取中')"
            clickable @click="$store.dispatch('vm/updateUserServerTableSingleStatus', props.server.id)">
      <q-tooltip>{{ $t('刷新云主机状态') }}</q-tooltip>
    </q-chip>

    <q-chip v-if="props.server.status === 0"
            class="text-bold" outline ripple="false" color="red" :label="$t('未获取')"
            clickable @click="$store.dispatch('vm/updateUserServerTableSingleStatus', props.server.id)">
      <q-tooltip>{{ $t('刷新云主机状态') }}</q-tooltip>
    </q-chip>

    <q-chip v-if="props.server.status === 1"
            class="text-bold" outline ripple="false" color="light-green" :label="$t('运行中')"
            clickable @click="$store.dispatch('vm/updateUserServerTableSingleStatus', props.server.id)">
      <q-tooltip>{{ $t('刷新云主机状态') }}</q-tooltip>
    </q-chip>

    <q-chip v-if="props.server.status === 2"
            class="text-bold" outline ripple="false" color="grey-9" :label="$t('已屏蔽')"
            clickable @click="$store.dispatch('vm/updateUserServerTableSingleStatus', props.server.id)">
      <q-tooltip>{{ $t('刷新云主机状态') }}</q-tooltip>
    </q-chip>

    <q-chip v-if="props.server.status === 3"
            class="text-bold" outline ripple="false" color="grey-9" :label="$t('已暂停')"
            clickable @click="$store.dispatch('vm/updateUserServerTableSingleStatus', props.server.id)">
      <q-tooltip>{{ $t('刷新云主机状态') }}</q-tooltip>
    </q-chip>

    <q-chip v-if="props.server.status === 4"
            class="text-bold" outline ripple="false" color="blue-5" :label="$t('关机中')"
            clickable @click="$store.dispatch('vm/updateUserServerTableSingleStatus', props.server.id)">
      <q-tooltip>{{ $t('刷新云主机状态') }}</q-tooltip>
    </q-chip>

    <q-chip v-if="props.server.status === 5"
            class="text-bold" outline ripple="false" color="grey-9" :label="$t('已关机')"
            clickable @click="$store.dispatch('vm/updateUserServerTableSingleStatus', props.server.id)">
      <q-tooltip>{{ $t('刷新云主机状态') }}</q-tooltip>
    </q-chip>

    <q-chip v-if="props.server.status === 6"
            class="text-bold" outline ripple="false" color="red" :label="$t('已崩溃')"
            clickable @click="$store.dispatch('vm/updateUserServerTableSingleStatus', props.server.id)">
      <q-tooltip>{{ $t('刷新云主机状态') }}</q-tooltip>
    </q-chip>

    <q-chip v-if="props.server.status === 7"
            class="text-bold" outline ripple="false" color="grey-9" :label="$t('被挂起')"
            clickable @click="$store.dispatch('vm/updateUserServerTableSingleStatus', props.server.id)">
      <q-tooltip>{{ $t('刷新云主机状态') }}</q-tooltip>
    </q-chip>

    <q-chip v-if="props.server.status === 9"
            class="text-bold" outline ripple="false" color="red" :label="$t('通讯失败')"
            clickable @click="$store.dispatch('vm/updateUserServerTableSingleStatus', props.server.id)">
      <q-tooltip>{{ $t('刷新云主机状态') }}</q-tooltip>
    </q-chip>

    <q-chip v-if="props.server.status === 10"
            class="text-bold" outline ripple="false" color="red" :label="$t('已丢失')"
            clickable @click="$store.dispatch('vm/updateUserServerTableSingleStatus', props.server.id)">
      <q-tooltip>{{ $t('刷新云主机状态') }}</q-tooltip>
    </q-chip>

    <q-chip v-if="props.server.status === 11"
            class="text-bold" outline ripple="false" color="blue-5" :label="$t('创建中')"
            clickable @click="$store.dispatch('vm/updateUserServerTableSingleStatus', props.server.id)">
      <q-tooltip>{{ $t('刷新云主机状态') }}</q-tooltip>
    </q-chip>

    <q-chip v-if="props.server.status === 12"
            class="text-bold" outline ripple="false" color="red" :label="$t('创建失败')"
            clickable @click="$store.dispatch('vm/updateUserServerTableSingleStatus', props.server.id)">
      <q-tooltip>{{ $t('刷新云主机状态') }}</q-tooltip>
    </q-chip>
  </span>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ServerInterface } from 'src/store/vm/state'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'ServerStatus',
  components: {},
  props: {
    server: {
      type: Object as PropType<ServerInterface>,
      required: true
    }
  },
  setup (props) {
    const $store = useStore<StateInterface>()
    return {
      props,
      $store
    }
  }
})
</script>

<style lang="scss" scoped>
.ServerStatus {
}
</style>
