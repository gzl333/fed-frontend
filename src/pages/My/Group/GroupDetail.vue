<template>
  <div class="GroupDetail">
    <div class="text-weight-bold text-h6 text-primary">
      <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense @click="goBack"/>
      项目组详情
    </div>
    <div class="row q-mt-xl">
      <div class="row column">
        <div class="text-weight-bold text-subtitle1">
          {{ $store.state.group.tables.groupTable.byId[groupId]?.name }}
        </div>
        <div class="text-weight-bold text-subtitle1 q-mt-xl">云主机</div>
      </div>
      <div class="row column">
        <div class="text-subtitle1 q-ml-xl">
          创建时间 {{ new Date($store.state.group.tables.groupTable.byId[groupId]?.creation_time).toLocaleString() }}
        </div>
        <div class="q-ml-xl">
          <q-btn outline color="primary" label="创建云主机" class="q-mt-xl"/>
        </div>
      </div>
    </div>
    <div class="row q-mt-xl">
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
                  <div class="col-3 text-light-blue-9 text-subtitle1 cursor-pointer" @click="toDetail(server.id)">
                    <span>{{ server.ipv4 }}</span>
                  </div>
                  <server-status :server="server" isGroup/>
                  <div class="col-6">
                    <q-btn push color="white" text-color="black" icon="cloud_upload" size="sm" label="开机"/>
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
      <div style="margin-left: 95px">
        <q-btn outline style="color: #2E9AFE;" label="添加组员" @click="addMember"/>
      </div>
    </div>
    <div class="row q-mt-xl">
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
                <div class="row column q-ml-md">
                  <div>
                    <q-chip outline square color="green" text-color="white" label="组长"/>
                    <q-chip outline square color="purple" text-color="white" label="管理员"/>
                    <q-chip outline square color="red" text-color="white" label="我自己"/>
                  </div>
                </div>
                <div class="q-mt-lg q-pb-lg">
                  <q-btn class="col-shrink" flat dense size="md" color="primary" label="云主机创建详情"/>
                </div>
              </div>
            </q-card-section>
          </div>
        </q-card>
      </div>
      <div class="col-5 q-ml-xl q-mt-lg"
           v-for="member in $store.state.group.tables.groupMemberTable.byId[groupId]?.members "
           :key="member.id">
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
                    <q-chip outline square color="green" text-color="white" label="组长" v-if="!member.role"/>
                    <q-chip outline square color="orange" text-color="white" label="组员"
                            v-if="member.role === 'member'"/>
                    <q-chip outline square color="purple" text-color="white" label="管理员"
                            v-if="member.role !== 'member'"/>
                    <q-chip outline square color="red" text-color="white" label="我自己" v-if="!member.role"/>
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
                    <q-btn outline style="color: #2E9AFE;" size="sm" label="移除" @click="delMember(groupId, member.user.username)"/>
                    <q-btn outline style="color: #2E9AFE; margin-left: 10px" size="sm" label="取消管理员"
                           v-if="member.role === 'leader'"
                           @click="$store.dispatch('group/switchMemberRole',{group_id: groupId,member_id: member.id, role:member.role})"/>
                    <q-btn outline style="color: #2E9AFE; margin-left: 10px" size="sm" label="设置管理员"
                           v-if="member.role === 'member'"
                           @click="$store.dispatch('group/switchMemberRole',{group_id: groupId,member_id: member.id, role:member.role})"/>
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
        <q-btn outline style="color: #2E9AFE; margin-left: 65px" label="申请组配额"/>
      </div>
    </div>
    <div class="q-mt-md">
      <quota-table :quotas="$store.getters['vm/getGroupQuotasByGroupIdByStatus'](groupId)('valid')"></quota-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useRouter } from 'vue-router'

import QuotaTable from 'components/QuotaTable/QuotaTable.vue'
import ServerStatus from 'components/ServerTable/ServerStatus.vue'

export default defineComponent({
  name: 'GroupDetail',
  components: {
    QuotaTable,
    ServerStatus
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const router = useRouter()
    const groupId = router.currentRoute.value.params.id as string
    const goBack = () => {
      router.go(-1)
    }
    const addMember = () => {
      void router.push('/my/group/add/' + groupId)
    }
    const toDetail = (id: string) => {
      void router.push(`/my/personal/vmdetail/${id}`)
    }
    const delMember = (groupId: string, username: string) => {
      void $store.dispatch('group/removeGroupMember', { groupId: groupId, username: username })
    }
    return {
      $store,
      groupId,
      goBack,
      addMember,
      delMember,
      toDetail
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupDetail {

}
</style>
