<template>
  <div class="GroupDetail">
    <div class="text-weight-bold text-h6">
      <q-btn icon="arrow_back_ios" color="black" flat unelevated dense
             @click="goBack"/>项目组详情</div>
    <div class="row q-mt-xl">
      <div class="row column">
        <div class="text-weight-bold text-subtitle1">
          {{ $store.state.group.tables.groupTable.byId[groupId]?.name }}
        </div>
        <div class="text-weight-bold text-subtitle1 q-mt-xl">云主机</div>
      </div>
      <div class="row column">
          <div class="text-subtitle1 q-ml-xl">
            {{ `创建时间 ${date}` }}
          </div>
          <div class="q-ml-xl">
            <q-btn outline style="color: #2E9AFE;" label="创建云主机" class="q-mt-xl"/>
          </div>
      </div>
    </div>
    <div class="row q-mt-xl">
      <div class="col-3 q-ml-xl" v-for="item in $store.state.group.tables.groupServerTable.byId" :key="item">
        <q-card class="my-card">
          <div class="row">
            <div class="col-4">
              <q-card-section>
                <q-icon name="print" class="text-teal q-mt-sm q-ml-md" style="font-size: 4.4em;"/>
              </q-card-section>
            </div>
            <div class="col-8">
              <q-card-section>
                <div class="column items-center">
                  <div class="col-3 text-light-blue-9">
                    <span>{{ item.ipv4 }}</span>
                  </div>
                  <div class="col-6">
                    <q-btn outline style="color: #2E9AFE;" icon="cloud_upload" size="15px" label="开机"/>
                  </div>
                  <div class="col-3">
                    <span>{{ `由${item.user.username}创建` }}</span>
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
              <div class="q-mt-md q-ml-md">
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/avatar.png">
                </q-avatar>
              </div>
            </q-card-section>
          </div>
          <div class="col-10">
            <q-card-section>
              <div class="row">
                <div class="text-light-blue-9 q-mt-sm">
                  <span>{{ $store.state.group.tables.groupMemberTable.byId[groupId]?.owner.username }}</span>
                </div>
                  <div class="row column q-ml-md">
                    <div>
                      <q-chip outline square color="green" text-color="white" label="组长"/>
                      <q-chip outline square color="purple" text-color="white" label="管理员"/>
                      <q-chip outline square color="red" text-color="white" label="我自己"/>
                    </div>
                    <div class="q-mt-md q-pb-xs">
                      <q-btn flat color="primary" label="云主机创建详情"/>
                    </div>
                  </div>
              </div>
            </q-card-section>
          </div>
        </q-card>
      </div>
      <div class="col-5 q-ml-xl q-mt-lg"
           v-for="item in $store.state.group.tables.groupMemberTable.byId[groupId]?.members "
           :key="item">
        <q-card class="my-card row">
          <div class="col-2">
            <q-card-section>
              <div class="q-mt-md q-ml-md">
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/avatar.png">
                </q-avatar>
              </div>
            </q-card-section>
          </div>
          <div class="col-10">
            <q-card-section>
              <div class="column">
                <div class="text-light-blue-9 row">
                  <div class="q-mt-sm"><span>{{ item.user.username }}</span></div>
                  <div class="q-ml-md">
                    <q-chip outline square color="green" text-color="white" label="组长" v-if="!item.role"/>
                    <q-chip outline square color="orange" text-color="white" label="组员" v-if="item.role === 'member'"/>
                    <q-chip outline square color="purple" text-color="white" label="管理员" v-if="item.role !== 'member'"/>
                    <q-chip outline square color="red" text-color="white" label="我自己" v-if="!item.role"/>
                  </div>
                </div>
                <div>
                  <span>{{ `由${item.inviter}邀请加入` }}</span>
                </div>
                <div>
                  <div class="row justify-end">
                    <q-btn flat color="primary" label="云主机创建详情"/>
                    <q-btn outline style="color: #2E9AFE;" size="sm" label="移除"/>
                    <q-btn outline style="color: #2E9AFE; margin-left: 10px" size="sm" label="取消管理员"
                           v-if="item.role !== 'member'"/>
                    <q-btn outline style="color: #2E9AFE; margin-left: 10px" size="sm" label="设置管理员"
                           v-if="item.role === 'member'"/>
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
        <q-btn outline style="color: #2E9AFE;" label="申请组配额"/>
      </div>
    </div>
    <div class="q-mt-md">
      <quota-table :quotas="quotas"></quota-table>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted } from 'vue'
import QuotaTable from 'components/QuotaTable/QuotaTable.vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useRouter } from 'vue-router'
import moment from 'moment'

export default defineComponent({
  name: 'GroupDetail',
  components: {
    QuotaTable
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const router = useRouter()
    const groupId = router.currentRoute.value.params.id as string
    void $store.dispatch('vm/updateUserQuotaTable')
    const filterSelection = ref({
      label: '全部',
      value: '0'
    })
    // 获取quota数据
    const quotas = computed(() => $store.getters['vm/getUserQuotasByFilter'](filterSelection.value.value))
    const date = moment($store.state.group.tables.groupTable.byId[groupId]?.creation_time).format('YYYY-MM-DD HH:mm:ss')
    const goBack = () => {
      router.go(-1)
    }
    const addMember = () => {
      void router.push('/my/group/add')
    }
    onMounted(async () => {
      void await $store.dispatch('group/updateGroup')
      void await $store.dispatch('group/updateGroupMember', groupId)
      void await $store.dispatch('group/updateGroupHostServer', groupId)
      // console.log('groupInformationTable', $store.state.group.tables.groupInformationTable)
      // console.log('groupMemberTable', $store.state.group.tables.groupMemberTable)
      // console.log('groupServerTable', $store.state.group.tables.groupServerTable)
    })
    return {
      groupId,
      quotas,
      filterSelection,
      $store,
      date,
      goBack,
      addMember
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupDetail {

}
</style>
