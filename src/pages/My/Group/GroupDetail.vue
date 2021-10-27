<template>
  <div class="GroupDetail">

    <div class="column items-center justify-center q-py-md">
      <div class="col q-pa-none">

        <div class="row items-center title-area">
          <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
                 @click="$router.back()"/>
          <span>项目组详情</span>
        </div>

        <!--直接从url进入本页面时，tables尚未载入，应显示loading界面。对取属性进行缓冲，不出现undefined错误-->
        <div class="row content-area">
          <div v-if="!groupMember || !group" class="col">
            正在加载，请稍候
          </div>

          <div v-else class="col">

            <!--项目组详情开始-->
            <div class="row items-center justify-evenly detail-area ">

              <div class="col-auto ">
                <div class="column justify-start items-center" style="height: 120px">
                  <div class="col-2 text-grey">
                    项目组名称
                  </div>
                  <div class="col-10">
                    <div class="row justify-center items-center text-bold" style="height: 70px">
                      {{ group.name }}

                    </div>
                  </div>
                </div>
              </div>

              <div class="col-auto ">
                <div class="column justify-start items-center" style="height: 120px">
                  <div class="col-2 text-grey">
                    备注
                  </div>
                  <div class="col-10">
                    <div class="row justify-center items-center" style="height: 70px">
                      {{ group.description }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-auto ">
                <div class="column justify-start items-center" style="height: 120px">
                  <div class="col-2 text-grey">
                    所属单位
                  </div>
                  <div class="col-10">
                    <div class="row justify-center items-center" style="height: 70px">
                      {{ group.company }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-auto ">
                <div class="column justify-start items-center" style="height: 120px">
                  <div class="col-2 text-grey">
                    组长
                  </div>
                  <div class="col-10">
                    <div class="row justify-center items-center" style="height: 70px">
                      {{ group.owner.username }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-auto ">
                <div class="column justify-start items-center" style="height: 120px">
                  <div class="col-2 text-grey">
                    建立时间
                  </div>
                  <div class="col-10">
                    <div class="row justify-center items-center" style="height: 70px">

                      <div v-if="locale==='zh'" class="column justify-center items-center">
                        <div class="col">{{ new Date(group.creation_time).toLocaleString(locale).split(' ')[0] }}</div>
                        <div class="col">{{ new Date(group.creation_time).toLocaleString(locale).split(' ')[1] }}</div>
                      </div>

                      <div v-else class="column justify-center items-center">
                        <div class="col">{{ new Date(group.creation_time).toLocaleString(locale).split(',')[0] }}</div>
                        <div class="col">{{ new Date(group.creation_time).toLocaleString(locale).split(',')[1] }}</div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              <div class="col-auto ">
                <div class="column justify-start items-center" style="height: 120px">
                  <div class="col-2 text-grey">
                    我的角色
                  </div>
                  <div class="col-10">
                    <div class="row justify-center items-center" style="height: 70px">
                      <group-role-chip :role="group.myRole"/>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="group.myRole !== 'member'" class="col-auto ">
                <div class="column justify-start items-center" style="height: 120px">
                  <div class="col-2 text-grey">
                    操作
                  </div>
                  <div class="col-10">
                    <div class="row justify-center items-center q-gutter-sm" style="height: 70px">

                      <q-btn icon="edit" flat padding="none" color="primary" size="md"
                             @click="$store.dispatch('account/editGroupDialog', group.id)">
                        <q-tooltip>编辑项目组信息</q-tooltip>
                      </q-btn>

                      <q-btn v-if="group.myRole ==='owner'" icon="group_off" flat padding="none"
                             color="primary" size="md"
                             @click="$store.dispatch('account/deleteGroupDialog', groupId)">
                        <q-tooltip>解散项目组</q-tooltip>
                      </q-btn>

                    </div>
                  </div>
                </div>
              </div>

            </div>
            <!--项目组详情结束-->

            <div class="column items-start q-py-none q-px-none">

              <div class="col-auto">
                <div class="row no-wrap justify-between items-center q-pt-lg  content-area">

                  <q-tabs
                    class="col-auto"
                    v-model="tab"
                    active-color="primary"
                    align="left"
                    inline-label
                  >
                    <q-tab class="q-px-none q-py-none q-mr-md"
                           no-caps
                           :ripple="false"
                           name="server"
                           icon="computer"
                           :label="$t('云主机')"/>
                    <q-tab class="q-px-none q-py-none q-mr-md"
                           no-caps
                           :ripple="false"
                           name="quota"
                           icon="fas fa-file-alt"
                           :label="$t('云主机配额')"/>
                    <q-tab v-if="group.myRole !== 'member'"
                           class="q-px-none q-py-none q-mr-md"
                           no-caps
                           :ripple="false"
                           name="application"
                           icon="rule"
                           :label="$t('配额申请记录')"/>
                    <q-tab class="q-px-none q-py-none q-mr-md"
                           no-caps
                           :ripple="false"
                           name="member"
                           icon="group"
                           :label="$t('成员')"/>
                  </q-tabs>

                  <q-btn v-show="tab==='member' && group.myRole !== 'member' " class="col-shrink" icon="add" size="md"
                         unelevated dense padding="xs"
                         color="primary" @click="$store.dispatch('account/addGroupMemberDialog', groupId)">
                    新增成员
                  </q-btn>

                  <q-btn v-show="tab==='server' && group.myRole !== 'member'" class="col-shrink" icon="add" size="md"
                         unelevated dense padding="xs"
                         color="primary" :to="{path: '/my/group/server/deploy', query: {group: groupId} }">
                    新建云主机
                  </q-btn>

                  <q-btn v-show="(tab==='quota'|| tab==='application')&& group.myRole !== 'member'" class="col-shrink"
                         icon="add" size="md"
                         unelevated dense padding="xs"
                         color="primary" :to="{path: '/my/group/quota/apply', query: {group: groupId} }">
                    申请新配额
                  </q-btn>

                </div>

                <q-separator/>

              </div>
              <div class="col-auto content-area">
                <q-tab-panels v-model="tab" animated>

                  <q-tab-panel class="q-pa-none overflow-hidden" name="server">
                    <server-table :servers="servers" is-group is-hide-group/>
                  </q-tab-panel>

                  <q-tab-panel class="q-pa-none overflow-hidden" name="quota">
                    <quota-table :quotas="quotas" is-group is-hide-group/>
                  </q-tab-panel>

                  <q-tab-panel v-if="group.myRole !== 'member'" class="q-pa-none overflow-hidden" name="application">
                    <quota-application-table :applications="applications" is-group is-hide-group/>
                  </q-tab-panel>

                  <q-tab-panel class="q-pa-none overflow-hidden" name="member">
                    <group-member-table :group-id="group.id"/>
                  </q-tab-panel>

                </q-tab-panels>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>

  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import GroupMemberTable from 'components/Group/GroupMemberTable.vue'
import GroupRoleChip from 'components/Group/GroupRoleChip.vue'
import ServerTable from 'components/Server/ServerTable.vue'
import QuotaTable from 'components/Quota/QuotaTable.vue'
import QuotaApplicationTable from 'components/Quota/QuotaApplicationTable.vue'

export default defineComponent({
  name: 'GroupDetail',
  components: {
    GroupMemberTable,
    GroupRoleChip,
    ServerTable,
    QuotaTable,
    QuotaApplicationTable
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $route = useRoute()
    const { locale } = useI18n({ useScope: 'global' })

    // url传参
    const show = $route.query.show as string // 子tab展示哪个部分

    // 从route对象中读取id参数
    const groupId = $route.params.id as string
    // group对象
    const group = computed(() => $store.state.account.tables.groupTable.byId[groupId])
    // groupMember
    const groupMember = computed(() => $store.state.account.tables.groupMemberTable.byId[groupId])
    // groupServer
    const servers = computed(() => $store.getters['server/getGroupServersByGroupId'](groupId))
    // groupQuota
    const quotas = computed(() => $store.getters['server/getGroupQuotasByGroupIdByStatus'](groupId, 'all'))
    // group quota applications
    const applications = computed(() => $store.getters['server/getGroupQuotaApplicationsByGroupId'](groupId))

    const tab = ref(show ?? 'server')

    return {
      locale,
      groupId,
      groupMember,
      group,
      servers,
      quotas,
      applications,
      tab
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupDetail {
}

.title-area {
  width: $general-width-no-padding;
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
}

.content-area {
  width: $general-width-no-padding;
}

.detail-area {
  margin-top: 10px;
  padding: 15px 0;
  height: 120px;
  border: $grey-4 1px solid;
  border-radius: 5px;
}
</style>
