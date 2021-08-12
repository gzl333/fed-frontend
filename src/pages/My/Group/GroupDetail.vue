<template>
  <div class="GroupDetail">
    <div class="text-weight-bold text-h6">项目组详情</div>
    <div class="row q-mt-xl">
      <div class="text-weight-bold text-subtitle1">测试组1</div>
      <div class="text-subtitle1 q-ml-xl">创建时间 2021.6.1</div>
    </div>
    <div class="row q-mt-xl">
      <div class="text-weight-bold text-subtitle1">云主机</div>
      <div class="q-ml-xl">
        <q-btn outline style="color: #2E9AFE;" label="创建云主机" />
      </div>
    </div>
    <div class="row q-mt-xl">
      <div class="col-3 q-ml-xl" v-for="item in CardType" :key="item">
        <q-card class="my-card">
          <div class="row">
            <div class="col-4">
              <q-card-section>
                <q-icon name="print" class="text-teal q-mt-sm q-ml-md" style="font-size: 4.4em;" />
              </q-card-section>
            </div>
            <div class="col-8">
              <q-card-section>
                <div class="column items-center">
                  <div class="col-3 text-light-blue-9">
                    <span>{{item.ip}}</span>
                  </div>
                  <div class="col-6">
                    <q-btn outline style="color: #2E9AFE;" icon="cloud_upload" size="15px" label="开机"/>
                  </div>
                  <div class="col-3">
                    <span>{{ `由${item.email}创建` }}</span>
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
        <q-btn outline style="color: #2E9AFE;" label="添加成员" />
      </div>
    </div>
    <div class="row q-mt-xl">
      <div class="col-5 q-ml-xl q-mt-lg" v-for="item in DetailType" :key="item">
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
                <div class="text-light-blue-9">
                  <span>{{item.id}}</span>
                  <q-chip outline square color="green" text-color="white" label="组长" v-if="item.isLeader === '1'" />
                  <q-chip outline square color="orange" text-color="white" label="组员" v-if="item.isLeader !== '1'" />
                  <q-chip outline square color="purple" text-color="white" label="管理员" v-if="item.isAdmin === '1'"/>
                  <q-chip outline square color="red" text-color="white" label="我自己" v-if="item.id === userId"/>
                </div>
                  <div v-if="item.invitee !== ''">
                    <span>{{`由${item.invitee}邀请加入`}}</span>
                  </div>
                <div>
                  <div :class="item.id !== userId ? 'row justify-end' : 'row justify-center q-mt-md q-pb-xs'">
                    <q-btn flat color="primary" label="云主机创建详情" />
                    <q-btn outline style="color: #2E9AFE;" size="sm" label="移除" v-if="item.id !== userId"/>
                    <q-btn outline style="color: #2E9AFE; margin-left: 10px" size="sm" label="取消管理员" v-if="item.isAdmin === '1' && item.id !== userId " />
                    <q-btn outline style="color: #2E9AFE; margin-left: 10px" size="sm" label="设置管理员" v-if="item.isAdmin !== '1' && item.id !== userId " />
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
          <q-btn outline style="color: #2E9AFE;" label="申请组配额" />
        </div>
      </div>
    <quota-table :quotas="quotas"></quota-table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import QuotaTable from 'components/QuotaTable/QuotaTable.vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'GroupDetail',
  components: {
    QuotaTable
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    void $store.dispatch('vm/updateUserQuotaTable')

    const userId = 'yzhang@cnic.cb'
    const CardType = ref([{ ip: '159.226.235.17', email: 'yzhang@cnic.cb' }, { ip: '169.226.235.27', email: 'duyukuan@cnic.cb' }, { ip: '179.226.235.28', email: 'yzhang123@cnic.cb' }])
    const DetailType = ref([{ id: 'yzhang@cnic.cb', invitee: '', isLeader: '1', isAdmin: '1' },
      { id: 'duyukuan@cnic.cb', invitee: 'yzhang@cnic.cb', isLeader: '0', isAdmin: '1' },
      { id: 'zhangsan@cnic.cb', invitee: 'duyukuan@cnic.cb', isLeader: '0', isAdmin: '1' },
      { id: 'lisi@cnic.cb', invitee: 'yzhang@cnic.cb', isLeader: '0', isAdmin: '0' }])
    const filterSelection = ref({
      label: '全部',
      value: '0'
    })
    // 获取quota数据
    const quotas = computed(() => $store.getters['vm/getUserQuotasByFilter'](filterSelection.value.value))
    return {
      CardType,
      DetailType,
      userId,
      quotas,
      filterSelection
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupDetail {

}
</style>
