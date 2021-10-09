<template>
  <div class="ServerOperationBtnGroup">
    <q-btn-group unelevated>

      <!-- todo 根据status 设计分类button-->

      <q-btn v-if="!props.server.status" padding="sm" color="nord4" loading label="......">
        <q-tooltip>
          {{ $t('远程执行中') }}
        </q-tooltip>
      </q-btn>
      <q-btn v-if="props.server.status && props.server.status!==1 && props.server.status!==5" padding="sm" color="nord4"
             text-color="primary" icon="refresh"
             @click="$store.dispatch('server/loadSingleServerStatus', {isGroup, serverId: props.server.id})">
        <q-tooltip>
          {{ $t('刷新云主机状态') }}
        </q-tooltip>
      </q-btn>
      <q-btn v-if="props.server.status==5" color="nord4" icon="play_arrow" text-color="primary" padding="sm"
             @click="$store.dispatch('server/serverOperationDialog',{serverId: props.server.id, action: 'start', isGroup})">
        <q-tooltip>
          {{ $t('开机') }}
        </q-tooltip>
      </q-btn>
      <q-btn v-if="props.server.status==1" color="nord4" icon="power_settings_new" text-color="primary"
             padding="sm"
             @click="$store.dispatch('server/serverOperationDialog',{serverId: props.server.id, action: 'shutdown', isGroup})">
        <q-tooltip>
          {{ $t('关机') }}
        </q-tooltip>
      </q-btn>

      <q-btn-dropdown color="primary" icon="more_horiz" dropdown-icon no-caps>

        <q-list style="text-align:center">
          <q-item clickable v-close-popup class="bg-white text-primary"
                  :to="{path: isGroup? `/my/group/server/detail/${props.server.id}` : `/my/personal/server/detail/${props.server.id}`}">
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

          <q-item v-if="props.server.status!==1" clickable v-close-popup class="bg-white text-primary"
                  @click="$store.dispatch('server/serverOperationDialog',{ serverId: props.server.id, action: 'start'}, isGroup)">
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

          <q-item v-if="props.server.status!==5" clickable v-close-popup class="bg-white text-primary"
                  @click="$store.dispatch('server/serverOperationDialog',{serverId: props.server.id, action: 'reboot',isGroup})">
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

          <q-item v-if="props.server.status!==5" clickable v-close-popup class="bg-white text-primary"
                  @click="$store.dispatch('server/serverOperationDialog',{serverId: props.server.id, action: 'shutdown',isGroup})">
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

          <q-item v-if="props.server.status!==5" clickable v-close-popup class="bg-white text-primary"
                  @click="$store.dispatch('server/serverOperationDialog',{serverId: props.server.id, action: 'poweroff',isGroup})">
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

          <q-item v-if="props.server.status!==1" clickable v-close-popup class="bg-white text-red"
                  @click="$store.dispatch('server/serverOperationDialog',{serverId: props.server.id, action: 'delete',isGroup})">
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
                  @click="$store.dispatch('server/serverOperationDialog',{serverId: props.server.id, action: 'delete_force',isGroup})">
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
import { defineComponent, PropType } from 'vue'
import { ServerInterface } from 'src/store/vm/state'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

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
    const $store = useStore<StateInterface>()
    return {
      props,
      $store
    }
  }
})
</script>

<style lang="scss" scoped>
.ServerOperationBtnGroup {
}
</style>
