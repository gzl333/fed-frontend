<template>
  <div class="GroupMember">
    <div class="column items-center justify-center q-py-md">
      <div class="col q-pa-none">

        <div class="row title-area">
          <div class="col">
            <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
                   @click="goBack"/>
            项目组人员
          </div>
        </div>

        <!--直接从url进入本页面时，tables尚未载入，应显示loading界面。对取属性进行缓冲，不出现undefined错误-->
        <div class="row content-area">
          <div v-if="!groupMember || !group" class="col">
            正在加载，请稍候
          </div>

          <div v-else class="col content-area">

            <!--项目组信息行开始-->
            <div class="row justify-start items-center q-pt-md ">
              <div class="col-auto">
                <div class="column">
                  <div class="col-auto">
                    <q-btn
                      class="q-pa-none q-ma-none" color="primary" padding="none" size="lg" flat dense unelevated
                      :to="{path: `/my/group/detail/${group.id}`}">
                      <div class="text-h4">
                        {{ group.name }}
                      </div>
                      <q-tooltip>
                        {{ $t('查看项目组详情') }}
                      </q-tooltip>
                    </q-btn>
                  </div>
                  <div class="col-auto">
                    {{ group.description }}
<!--                    <q-btn icon="edit" flat padding="none" color="primary" size="sm">-->
<!--                      <q-tooltip>编辑备注</q-tooltip>-->
<!--                    </q-btn>-->
                  </div>
                </div>
              </div>
            </div>

            <div class="row justify-start items-center ">
              <div class="col-auto">
                <div class="q-pt-lg q-pb-sm text-grey">
                  组长
                </div>
                <div>
                  {{ group.owner.username }}
                  <q-btn v-if="group.myRole ==='owner'" icon="mdi-account-convert" flat padding="none" color="primary"
                         size="sm">
                    <q-tooltip>移交项目组</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>

            <!--项目组信息行结束-->
            <!--人员列表开始-->
            <div class="row">
              <div class="col">

                <div class="row justify-between items-center q-pt-lg q-pb-sm ">
                  <div class="col-auto text-grey">
                    人员列表
                  </div>
                  <div class="col-auto">
                    <q-btn icon="add" unelevated dense padding="xs" color="primary">
                      增加人员
                    </q-btn>
                  </div>
                </div>

                <group-member-table :members="groupMember.members" :is-owner="group.myRole === 'owner'"/>

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
import GroupMemberTable from 'components/Group/GroupMemberTable.vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'GroupMember',
  components: { GroupMemberTable },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $router = useRouter()
    const $route = useRoute()

    // 返回上一页
    const goBack = () => {
      $router.go(-1)
    }

    // 从route对象中读取id参数
    const groupId = $route.params.id as string
    // 获取groupMember对象
    const groupMember = computed(() => $store.state.account.tables.groupMemberTable.byId[groupId])
    // 获取group对象
    const group = computed(() => $store.state.account.tables.groupTable.byId[groupId])

    return {
      $store,
      goBack,
      groupMember,
      group
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupMember {
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

</style>
