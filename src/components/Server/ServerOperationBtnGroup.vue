<template>
  <div class="ServerOperationBtnGroup">
    <q-btn-group unelevated>

      <q-btn color="grey-3" padding="none">
        <q-toggle
          v-model="toggle"
          checked-icon="lock"
          unchecked-icon="lock_open"
          color="light-green"
          size="md"
          @click=" $store.dispatch('server/toggleOperationLock', {isGroup, serverId: server.id })"
        >
          <q-tooltip v-if="server.lock === 'lock-operation'">
            {{ $t('已锁定云主机操作') }}
          </q-tooltip>
          <q-tooltip v-else>
            {{ $t('未锁定云主机操作') }}
          </q-tooltip>
        </q-toggle>
      </q-btn>

      <q-btn-dropdown color="primary" dropdown-icon="expand_more" :ripple="false" split no-caps
                      :disable-main-btn="server.lock === 'lock-operation'"
                      :loading="!server?.status"
                      :icon="server?.status===5?'play_arrow':server?.status==1?'power_settings_new':'refresh'"
                      @click="server?.status===5 ? $store.dispatch('server/serverOperationDialog',{serverId: server.id, action: 'start', isGroup})
                      : server?.status==1?$store.dispatch('server/serverOperationDialog',{serverId: server.id, action: 'shutdown', isGroup})
                      : $store.dispatch('server/loadSingleServerStatus', {isGroup, serverId: server.id})">

        <q-list style="text-align:center">
          <q-item clickable v-close-popup class="bg-white text-primary"
                  :to="{path: isGroup? `/my/group/server/detail/${server.id}` : `/my/personal/server/detail/${server.id}`}">
            <div class="row">
              <q-item-section class="col-auto">
                <q-icon name="info" size="sm"/>
              </q-item-section>
              <q-item-section class="col-auto">
                <q-item-label>
                  {{ $t('云主机详情') }}
                </q-item-label>
              </q-item-section>
            </div>
          </q-item>

          <q-separator/>

          <q-item v-if="server.status!==1" clickable v-close-popup class="bg-white text-primary"
                  :disable="server.lock === 'lock-operation'"
                  @click="$store.dispatch('server/serverOperationDialog',{ serverId: server.id, action: 'start'}, isGroup)">
            <div class="row">
              <q-item-section class="col-auto">
                <q-icon name="play_arrow" size="sm"/>
              </q-item-section>
              <q-item-section class="col-auto">
                <q-item-section>
                  <q-item-label>{{ $t('开机') }}</q-item-label>
                </q-item-section>
              </q-item-section>
            </div>
          </q-item>

          <q-item v-if="server.status!==5" clickable v-close-popup class="bg-white text-primary"
                  :disable="server.lock === 'lock-operation'"
                  @click="$store.dispatch('server/serverOperationDialog',{serverId: server.id, action: 'reboot',isGroup})">
            <div class="row">
              <q-item-section class="col-auto">
                <q-icon name="restart_alt" size="sm"/>
              </q-item-section>
              <q-item-section class="col-auto">
                <q-item-section>
                  <q-item-label>{{ $t('重启') }}</q-item-label>
                </q-item-section>
              </q-item-section>
            </div>
          </q-item>

          <q-item v-if="server.status!==5" clickable v-close-popup class="bg-white text-primary"
                  :disable="server.lock === 'lock-operation'"
                  @click="$store.dispatch('server/serverOperationDialog',{serverId: server.id, action: 'shutdown',isGroup})">
            <div class="row">
              <q-item-section class="col-auto">
                <q-icon name="power_settings_new" size="sm"/>
              </q-item-section>
              <q-item-section class="col-auto">
                <q-item-section>
                  <q-item-label>{{ $t('关机') }}</q-item-label>
                </q-item-section>
              </q-item-section>
            </div>
          </q-item>

          <q-item v-if="server.status!==5" clickable v-close-popup class="bg-white text-primary"
                  :disable="server.lock === 'lock-operation'"
                  @click="$store.dispatch('server/serverOperationDialog',{serverId: server.id, action: 'poweroff',isGroup})">
            <div class="row">
              <q-item-section class="col-auto">
                <q-icon name="power_off" size="sm"/>
              </q-item-section>
              <q-item-section class="col-auto">
                <q-item-section>
                  <q-item-label>{{ $t('强制断电') }}</q-item-label>
                </q-item-section>
              </q-item-section>
            </div>
          </q-item>

          <q-separator/>

          <q-item v-if="server.status!==1" clickable v-close-popup class="bg-white text-red"
                  :disable="server.lock === 'lock-operation'"
                  @click="$store.dispatch('server/serverOperationDialog',{serverId: server.id, action: 'delete',isGroup})">
            <div class="row">
              <q-item-section class="col-auto">
                <q-icon name="delete" size="sm"/>
              </q-item-section>
              <q-item-section class="col-auto">
                <q-item-section>
                  <q-item-label>{{ $t('删除') }}</q-item-label>
                </q-item-section>
              </q-item-section>
            </div>
          </q-item>

          <q-item clickable v-close-popup class="bg-white text-red"
                  :disable="server.lock === 'lock-operation'"
                  @click="$store.dispatch('server/serverOperationDialog',{serverId: server.id, action: 'delete_force',isGroup})">
            <div class="row">
              <q-item-section class="col-auto">
                <q-icon name="delete_forever" size="sm"/>
              </q-item-section>
              <q-item-section class="col-auto">
                <q-item-section>
                  <q-item-label>{{ $t('强制删除') }}</q-item-label>
                </q-item-section>
              </q-item-section>
            </div>
          </q-item>

        </q-list>
      </q-btn-dropdown>

    </q-btn-group>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, PropType } from 'vue'
import { ServerInterface } from 'src/store/server/state'
// import { useStore } from 'vuex'
// import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'ServerOperationBtnGroup',
  components: {},
  props: {
    server: {
      type: Object as PropType<ServerInterface>,
      required: true
    },
    isGroup: {
      type: Boolean,
      required: false
    }
  },
  setup (props) {
    const toggle = ref(computed(() => props.server.lock === 'lock-operation'))
    return {
      toggle
    }
  }
})
</script>

<style lang="scss" scoped>
.ServerOperationBtnGroup {
}
</style>
