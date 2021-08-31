<template>
  <div class="GroupEdit">
    <div class="column items-center justify-center q-py-md">
      <div class="col q-pa-none">

        <div class="row title-area">
          <div class="col">
            <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
                   @click="goBack"/>
            项目组设置
          </div>
        </div>

        <!--直接从url进入本页面时，tables尚未载入，应显示loading界面。对取属性进行缓冲，不出现undefined错误-->
        <div class="row content-area">
          <div v-if="!groupMember || !group" class="col">
            正在加载，请稍候
          </div>

          <div v-else class="col">
            <!--            配额详情开始-->
            <div class="row items-center justify-evenly detail-area ">

              <div class="col-auto ">
                <div class="column justify-start items-center" style="height: 120px">
                  <div class="col-2 text-grey">
                    项目组名称
                  </div>
                  <div class="col-10">
                    <div class="row justify-center items-center text-bold" style="height: 70px">
                      {{ group.name }}

                      <!--                      <q-btn-->
                      <!--                        class="q-pa-none q-ma-none" color="primary" padding="none" size="md" flat dense unelevated-->
                      <!--                        :to="{path: `/my/group/detail/${group.id}`}">-->
                      <!--                        <div class="">-->
                      <!--                          {{ group.name }}-->
                      <!--                        </div>-->
                      <!--                        <q-tooltip>-->
                      <!--                          {{ $t('详情') }}-->
                      <!--                        </q-tooltip>-->
                      <!--                      </q-btn>-->

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
                    操作
                  </div>
                  <div class="col-10">
                    <div class="row justify-center items-center q-gutter-sm" style="height: 70px">

                      <q-btn icon="edit" flat padding="none" color="primary" size="sm"
                             @click="$store.dispatch('group/editGroupDialog', group.id)">
                        <q-tooltip>编辑项目组信息</q-tooltip>
                      </q-btn>

                      <q-btn disable v-if="group.myRole ==='owner'" icon="mdi-account-convert" flat padding="none"
                             color="primary"
                             size="sm">
                        <q-tooltip>移交项目组</q-tooltip>
                      </q-btn>

                    </div>
                  </div>
                </div>
              </div>

            </div>
            <!--            配额详情结束-->

            <!--人员列表开始-->
            <div class="row">
              <div class="col">

                <div class="row justify-between items-center q-pt-lg q-pb-sm ">
                  <div class="col-auto text-grey">
                    人员列表
                  </div>
                  <div class="col-auto">
                    <q-btn icon="add" size="sm" unelevated dense padding="xs" color="primary"
                           @click="$store.dispatch('group/addGroupMemberDialog', group.id)">
                      增加人员
                    </q-btn>
                  </div>
                </div>

                <group-member-table :group-id="group.id"/>

              </div>
            </div>
            <!--人员列表结束-->
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useRoute, useRouter } from 'vue-router'
import GroupMemberTable from 'components/Group/GroupMemberTable.vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'GroupEdit',
  components: { GroupMemberTable },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $router = useRouter()
    const $route = useRoute()
    const { locale } = useI18n({ useScope: 'global' })

    // 返回上一页
    const goBack = () => {
      $router.go(-1)
    }

    // 从route对象中读取id参数
    const groupId = $route.params.id as string
    // 获取groupMember对象
    const groupMember = computed(() => $store.state.group.tables.groupMemberTable.byId[groupId])
    // 获取group对象
    const group = computed(() => $store.state.group.tables.groupTable.byId[groupId])

    return {
      $store,
      locale,
      goBack,
      groupMember,
      group
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
