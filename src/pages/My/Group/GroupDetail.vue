<template>
  <div class="GroupDetail">
    <div class="text-weight-bold text-h6 text-primary">
      <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense @click="goBack"/>
      项目组详情
    </div>
    <group-header-information></group-header-information>
    <div class="row q-mt-xl">
        <div class="text-weight-bold text-subtitle1">云主机</div>
        <div class="q-ml-xl">
          <q-btn outline color="primary" label="创建云主机" :to="{path: '/my/group/server/deploy', query: {group: groupId}}"/>
        </div>
    </div>
    <div class="row q-mt-lg q-ml-xl">
      <div class="col-3 q-ml-xl q-mt-lg" v-for="server in $store.getters['vm/getGroupServersByGroupId'](groupId)"
           :key="server.id">
        <q-card class="my-card">
          <div class="row">
            <div class="col-4">
              <q-card-section>
                <q-icon name="print" class="text-teal q-mt-lg q-ml-lg" style="font-size: 4.4em;"/>
              </q-card-section>
            </div>
            <div class="col-8">
              <q-card-section>
                <div class="column items-center">
                  <q-btn flat color="primary" padding="none" size="lg" :to="{path: '/my/group/server/detail/' + server.id}" >
                    {{ server.ipv4 }}
                  </q-btn>
                  <server-status :server="server" :is-group="true"/>
                  <div class="col-6">
                    <q-btn v-show="$store.state.vm.tables.groupServerTable.byId[server.id]?.status === 5" push color="white" text-color="black" icon="cloud_upload" size="sm" label="开机"
                           @click="$store.dispatch('vm/serverOperationDialog', {serverId: server.id, action:'start', isGroup: true} )"/>
                    <q-btn v-show="$store.state.vm.tables.groupServerTable.byId[server.id]?.status === 1" push color="white" text-color="black" icon="cloud_upload" size="sm" label="关机"
                           @click="$store.dispatch('vm/serverOperationDialog', {serverId: server.id, action:'shutdown', isGroup: true} )"/>
                    <q-btn v-show="$store.state.vm.tables.groupServerTable.byId[server.id]?.status === ''" flat color="white" size="sm"/>
                  </div>
                  <div class="col-3 text-weight-light text-caption">
                    <span>{{ `由${server.user.username}创建` }}</span>
                  </div>
                </div>
              </q-card-section>
            </div>
          </div>
        </q-card>
      </div>
    </div>
    <div class="row q-mt-xl">
      <div class="text-weight-bold text-subtitle1">组员列表</div>
      <div class="q-ml-xl">
        <q-btn outline style="color: #2E9AFE;" label="添加组员" @click="$store.dispatch('group/addGroupMemberDialog', groupId)"/>
      </div>
    </div>
    <div class="row q-mt-lg">
      <div class="col-5 q-ml-xl q-mt-lg">
        <q-card class="my-card row">
          <div class="col-2">
            <q-card-section>
              <div class="q-mt-lg q-ml-md">
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/avatar2.jpg">
                </q-avatar>
              </div>
            </q-card-section>
          </div>
          <div class="col-10">
            <q-card-section>
              <div class="row">
                <div class="text-light-blue-9 q-mt-sm cursor-pointer">
                  <span>{{ $store.state.group.tables.groupMemberTable.byId[groupId]?.owner.username }}</span>
                </div>
                <div class="q-ml-md">
                  <group-role-chip role="owner"></group-role-chip>
                </div>
              </div>
              <div class="q-mt-lg q-pb-lg">
                <q-btn class="col-shrink" flat dense size="md" color="primary" label="云主机创建详情"/>
              </div>
            </q-card-section>
          </div>
        </q-card>
      </div>
      <div class="col-5 q-ml-xl q-mt-lg" v-for="(member, index) in groupMembers" :key="index">
        <q-card class="my-card row">
          <div class="col-2">
            <q-card-section>
              <div class="q-mt-lg q-ml-md">
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/avatar1.jpg">
                </q-avatar>
              </div>
            </q-card-section>
          </div>
          <div class="col-10">
            <q-card-section>
              <div class="column">
                <div class="text-light-blue-9 row">
                  <div class="q-mt-sm cursor-pointer"><span>{{ member.user.username }}</span></div>
                  <div class="q-ml-md">
                    <group-role-chip :role="member.role"></group-role-chip>
                  </div>
                </div>
                <div>
                  <div>
                    <span>{{ `由${member.inviter}邀请加入` }}</span>
                  </div>
                  <div>
                    <q-btn class="col-shrink" flat dense size="md" color="primary" label="云主机创建详情"/>
                  </div>
                </div>
                <div>
                  <div class="row justify-end">
                    <q-btn outline style="color: #2E9AFE;" size="sm" label="移除"
                           @click="$store.dispatch('group/removeSingleGroupMemberDialog', {groupId, username: member.user.username})"/>
                    <q-btn outline style="color: #2E9AFE; margin-left: 10px" size="sm" label="取消管理员"
                           v-if="member.role === 'leader'"
                           @click="$store.dispatch('group/editGroupMemberRoleDialog', {groupId, member_id: member.id, role:'member', role_name: '成员'})"/>
                    <q-btn outline style="color: #2E9AFE; margin-left: 10px" size="sm" label="设置管理员"
                           v-if="member.role === 'member'"
                           @click="$store.dispatch('group/editGroupMemberRoleDialog', {groupId, member_id: member.id, role:'leader', role_name: '管理员'})"/>
                  </div>
                </div>
              </div>
            </q-card-section>
          </div>
        </q-card>
      </div>
    </div>
    <div class="row q-mt-xl">
      <div class="text-weight-bold text-subtitle1">组配额</div>
      <div class="q-ml-xl">
        <q-btn outline style="color: #2E9AFE" class="q-ml-md" label="申请组配额" :to="{path: '/my/group/quota/apply', query: {group: groupId} }"/>
      </div>
    </div>
    <div class="q-mt-md">
      <quota-table :is-group="true" :quotas="$store.getters['vm/getGroupQuotasByGroupIdByStatus'](groupId)('valid')" ></quota-table>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useRouter } from 'vue-router'

import QuotaTable from 'components/Quota/QuotaTable.vue'
import ServerStatus from 'components/Server/ServerStatus.vue'
import GroupRoleChip from 'components/Group/GroupRoleChip.vue'
import GroupHeaderInformation from 'pages/My/Group/GroupHeaderInformation.vue'
export default defineComponent({
  name: 'GroupDetail',
  components: {
    QuotaTable,
    ServerStatus,
    GroupRoleChip,
    GroupHeaderInformation

  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const router = useRouter()
    const groupId = router.currentRoute.value.params.id as string
    const groupMembers = computed(() => $store.getters['group/getMemberByTime'](groupId))
    const goBack = () => {
      router.go(-1)
    }
    return {
      $store,
      groupId,
      goBack,
      groupMembers
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupDetail {

}
</style>
