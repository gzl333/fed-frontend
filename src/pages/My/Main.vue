<template>
  <div class="Main">
    <div class="column">

      <div class="col-auto">
        <div class="row justify-center">
          <global-header class="content-fixed-width"/>
        </div>
      </div>

      <q-separator/>

      <div class="col-auto">
        <div class="row justify-center">
          <div class="content-fixed-width">
            <q-banner v-if="isBannerOn" class="col  q-mt-lg banner-border shadow-5" inline-actions>
              <template v-slot:action>
                <q-btn flat padding="none" color="primary" label="忽略" @click="isBannerOn=false"/>
              </template>
              <div>
                <q-btn class="text-h6" flat padding="none" color="primary" :to="{path: '/news/center-beta'}">
                  中国科技云联邦内测公告
                </q-btn>
              </div>
            </q-banner>
          </div>
        </div>
      </div>

      <div class="col-auto">
        <div class="row justify-center">
          <div class="content-fixed-width">

            <div class="column">
              <div class="col">
                <div class="row">

                  <div class="col q-pt-lg q-mr-md">
                    <q-tabs
                      v-model="tab1"
                      active-color="black"
                      active-bg-color=""
                      indicator-color="primary"
                      align="left"
                      narrow-indicator
                    >
                      <q-tab class="q-px-sm text-h6 " name="fed">云联邦</q-tab>
                      <q-tab class="q-px-sm text-h6 " name="sum">资源汇聚</q-tab>
                    </q-tabs>

                    <q-tab-panels v-model="tab1" animated class="non-selectable">
                      <q-tab-panel name="fed" class="tab1" style="overflow: hidden;">
                        <div class="row justify-start items-center q-gutter-lg counts">
                          <div class="col-auto">
                            当前机构数量：
                            <span class="text-primary text-h4">
                              {{ $store.state.fed.tables.dataCenterTable.allIds?.length }}
                            </span>
                          </div>
                          <div class="col-auto">
                            当前服务数量：
                            <span class="text-primary text-h4">
                              {{ $store.state.fed.tables.serviceTable.allIds?.length }}
                            </span>
                          </div>
                        </div>
                      </q-tab-panel>

                      <q-tab-panel name="sum" class="tab2" style="overflow: hidden;">

                      </q-tab-panel>
                    </q-tab-panels>
                  </div>

                  <div class="col q-pt-lg">
                    <div class="row justify-between items-center q-pt-sm">
                      <div class="col-auto">
                        <div class="text-h6 ">
                          新闻动态
                        </div>
                      </div>
                      <div class="col-auto">
                        <q-btn flat padding="none" color="primary" icon="more_horiz" :to="{path:'/news'}">更多</q-btn>
                      </div>
                    </div>

                    <div>
                      <q-list dense bordered padding class="rounded-borders q-mt-sm">

                        <q-item clickable to="/news/center-beta">
                          <q-item-section>
                            <div class="row justify-between">
                              <div class="col-auto">中国科技云联邦进行网络中心内测</div>
                              <div class="col-auto">2021-10-26</div>
                            </div>
                          </q-item-section>
                        </q-item>

                        <q-item clickable>
                          <q-item-section>
                            <div class="row justify-between">
                              <div class="col-auto">中国科技云联邦进行科技云部内测</div>
                              <div class="col-auto">2021-07-26</div>
                            </div>
                          </q-item-section>
                        </q-item>

                        <q-item clickable>
                          <q-item-section>
                            <div class="row justify-between">
                              <div class="col-auto">中国科技云联邦alpha版本上线</div>
                              <div class="col-auto">2021-07-01</div>
                            </div>
                          </q-item-section>
                        </q-item>

                        <q-item clickable>
                          <q-item-section>
                            <div class="row justify-between">
                              <div class="col-auto">中国科技云联邦demo版本上线</div>
                              <div class="col-auto">2021-04-01</div>
                            </div>
                          </q-item-section>
                        </q-item>

                        <q-item clickable>
                          <q-item-section>
                            <div class="row justify-between">
                              <div class="col-auto">中国科技云联邦研发启动</div>
                              <div class="col-auto">2021-01-01</div>
                            </div>
                          </q-item-section>
                        </q-item>

                      </q-list>
                    </div>
                  </div>

                </div>
              </div>
              <div class="col">
                <div class="row q-mt-md justify-between items-center">
                  <div class="col-auto text-h6">
                    {{ $t('个人云主机') }}
                  </div>
                  <div class="col-auto ">
                    <q-btn class="q-mr-md" flat padding="none" color="primary" icon="add"
                           :to="{path: '/my/personal/server/deploy'}">新建
                    </q-btn>
                    <q-btn flat padding="none" color="primary" icon="more_horiz" :to="{path:'/my/personal/server'}">更多
                    </q-btn>
                  </div>
                </div>
                <q-separator color="grey-5"/>
                <ServerTable v-if="servers" :servers="servers"/>
                <div v-else>暂无云主机，请创建后使用</div>
              </div>

              <div class="col">
                <div class="row q-mt-md justify-between items-center">
                  <div class="col-auto text-h6 ">
                    {{ $t('项目组') }}
                  </div>
                  <div class="col-auto ">
<!--                    <q-btn disable class="q-mr-md" flat padding="none" color="primary" icon="add">新建</q-btn>-->
                    <q-btn flat padding="none" color="primary" icon="more_horiz" :to="{path:'/my/group'}">更多</q-btn>
                  </div>
                </div>
                <q-separator color="grey-5"/>
                <GroupTable :groups="groups"/>
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

import GlobalHeader from 'components/GlobalHeader/GlobalHeader.vue'
import ServerTable from 'components/Server/ServerTable.vue'
// import BucketTable from 'components/BucketTable/BucketTable.vue'
import GroupTable from 'components/Group/GroupTable.vue'

export default defineComponent({
  name: 'Main',
  components: {
    GlobalHeader,
    ServerTable,
    // BucketTable,
    GroupTable
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const currentUser = $store.state.account.items.decoded?.name

    const tab1 = ref('fed')
    const tab2 = ref('')

    // 获取云主机列表数据
    const servers = computed(() => $store.getters['server/getPersonalServers'].slice(0, 3))

    // group data
    const groups = computed(() => $store.getters['account/getGroupsByFilter']('all').slice(0, 3))

    // 获取对象存储桶数据列表，目前是测试数据
    // const buckets = [
    // //   {
    // //   bucketName: '测试桶1',
    // //   domainName: 'obs.cstcloud.cn',
    // //   count: 100,
    // //   volume: '20GB',
    // //   status: true,
    // //   writeRead: 'pass1',
    // //   readonly: 'pass1-1',
    // //   creation: '2021-6-21 15:37'
    // // },
    // // {
    // //   bucketName: '测试桶2',
    // //   domainName: 'obs.cstcloud.cn',
    // //   count: 289,
    // //   volume: '300GB',
    // //   status: false,
    // //   writeRead: 'pass2',
    // //   readonly: 'pass2-1',
    // //   creation: '2021-6-21 15:37'
    // // },
    // // {
    // //   bucketName: '测试桶3',
    // //   domainName: 'obs.cstcloud.cn',
    // //   count: 500,
    // //   volume: '600GB',
    // //   status: true,
    // //   writeRead: 'pass3',
    // //   readonly: 'pass3-1',
    // //   creation: '2021-6-21 15:37'
    // // }
    // ]

    const isBannerOn = ref(true)

    return {
      $store,
      currentUser,
      tab1,
      tab2,
      servers,
      groups,
      // buckets,
      isBannerOn
    }
  }
})
</script>

<style lang="scss" scoped>
.Main {
}

.banner-border {
  border-left: 5px solid $primary;
}

// todo debug
.tab1 {
  background-image: url('/img/city_map.png');
  background-repeat: no-repeat;
  background-size: auto;
  height: 190px;
}

.tab2 {
  background-image: url('/img/fed_map.png');
  background-repeat: no-repeat;
  background-size: contain;
  height: 190px;
}

.counts {
  position: relative;
  top: 135px;
}
</style>
