<template>
  <div class="GroupEdit">
    <div class="column items-center justify-center q-py-md">
      <div class="col q-pa-none">

        <div class="row title-area">
          <div class="col">
            <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
                   @click="$router.go(-1)"/>
            项目组详情
          </div>
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
                    操作
                  </div>
                  <div class="col-10">
                    <div class="row justify-center items-center q-gutter-sm" style="height: 70px">

                      <q-btn icon="edit" flat padding="none" color="primary" size="sm"
                             @click="$store.dispatch('group/editGroupDialog', group.id)">
                        <q-tooltip>编辑项目组信息</q-tooltip>
                      </q-btn>

                      <q-btn v-if="group.myRole ==='owner'" icon="remove_circle" flat padding="none"
                             color="primary" size="sm">
                        <q-tooltip>删除项目组</q-tooltip>
                      </q-btn>

                    </div>
                  </div>
                </div>
              </div>

            </div>
            <!--项目组详情结束-->

            <div class="column items-start q-py-none q-px-none">

              <div class="col-auto">
                <q-tabs
                  v-model="tab"
                  active-color="primary"
                  align="left"
                  narrow-indicator
                >
                  <q-tab class="q-px-none q-py-none q-mr-md"
                               :ripple="false"
                               name="member"
                               label="人员"/>
                  <q-tab class="q-px-none q-py-none q-mr-md"
                               :ripple="false"
                               name="server"
                               label="云主机"/>
                  <q-tab class="q-px-none q-py-none q-mr-md"
                         :ripple="false"
                         name="quota"
                         label="云主机配额"/>
                </q-tabs>

              </div>
<!--todo 宽度问题-->
              <div class="col-auto content-fixed-width">
                <q-separator/>
                <q-tab-panels v-model="tab" animated>
                  <q-tab-panel name="member">
                    <group-member-table :group-id="group.id"/>
                  </q-tab-panel>

                  <q-tab-panel name="server">
                    <server-table is-group :servers="servers"/>
                  </q-tab-panel>

                  <q-tab-panel name="quota">
                    <quota-table :quotas="quotas" is-group/>
                  </q-tab-panel>
                </q-tab-panels>
              </div>

            </div>

<!--            &lt;!&ndash;人员列表开始&ndash;&gt;-->
<!--            <div class="row">-->
<!--              <div class="col">-->
<!--                <div class="row justify-between items-center q-pt-lg q-pb-sm ">-->
<!--                  <div class="col-auto text-grey">-->
<!--                    人员-->
<!--                  </div>-->
<!--                  <div class="col-auto">-->
<!--                    <q-btn icon="add" size="md" unelevated dense padding="xs" color="primary"-->
<!--                           @click="$store.dispatch('group/addGroupMemberDialog', group.id)">-->
<!--                      增加人员-->
<!--                    </q-btn>-->
<!--                  </div>-->
<!--                </div>-->

<!--                <group-member-table :group-id="group.id"/>-->

<!--              </div>-->
<!--            </div>-->
<!--            &lt;!&ndash;人员列表结束&ndash;&gt;-->

<!--            &lt;!&ndash;云主机列表开始&ndash;&gt;-->
<!--            <div class="row">-->
<!--              <div class="col">-->
<!--                <div class="row justify-between items-center q-pt-lg q-pb-sm ">-->
<!--                  <div class="col-auto text-grey">-->
<!--                    云主机-->
<!--                  </div>-->
<!--                  <div class="col-auto">-->
<!--                    <q-btn icon="add" size="md" unelevated dense padding="xs" color="primary">-->
<!--                      新建云主机-->
<!--                    </q-btn>-->
<!--                  </div>-->
<!--                </div>-->

<!--                <server-table is-group :servers="servers"/>-->

<!--              </div>-->
<!--            </div>-->
<!--            &lt;!&ndash;云主机列表结束&ndash;&gt;-->

<!--            &lt;!&ndash;云主机配额列表开始&ndash;&gt;-->
<!--            <div class="row">-->
<!--              <div class="col">-->
<!--                <div class="row justify-between items-center q-pt-lg q-pb-sm ">-->
<!--                  <div class="col-auto text-grey">-->
<!--                    云主机配额-->
<!--                  </div>-->
<!--                  <div class="col-auto">-->
<!--                    <q-btn icon="add" size="md" unelevated dense padding="xs" color="primary">-->
<!--                      申请新配额-->
<!--                    </q-btn>-->
<!--                  </div>-->
<!--                </div>-->

<!--                <quota-table :quotas="quotas" is-group/>-->

<!--              </div>-->
<!--            </div>-->
<!--            &lt;!&ndash;云主机配额列表结束&ndash;&gt;-->

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
import ServerTable from 'components/Server/ServerTable.vue'
import QuotaTable from 'components/Quota/QuotaTable.vue'

export default defineComponent({
  name: 'GroupEdit',
  components: {
    GroupMemberTable,
    ServerTable,
    QuotaTable
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $route = useRoute()
    const { locale } = useI18n({ useScope: 'global' })

    // 从route对象中读取id参数
    const groupId = $route.params.id as string
    // group对象
    const group = computed(() => $store.state.group.tables.groupTable.byId[groupId])
    // groupMember
    const groupMember = computed(() => $store.state.group.tables.groupMemberTable.byId[groupId])
    // groupServer
    const servers = computed(() => $store.getters['vm/getGroupServersByGroupId'](groupId))
    // groupQuota
    const quotas = computed(() => $store.getters['vm/getGroupQuotasByGroupIdByStatus'](groupId, 'all'))

    const tab = ref('member')

    return {
      $store,
      locale,
      groupMember,
      group,
      servers,
      quotas,
      tab
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupEdit {
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
