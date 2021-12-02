<template>
  <div class="Main">
    <div class="column">

      <!--      <div class="col-auto">-->
      <!--        <div class="row justify-center">-->
      <!--          <global-header-content class="content-fixed-width"/>-->
      <!--        </div>-->
      <!--      </div>-->

      <!--      <q-separator/>-->

      <div class="col-auto">
        <div class="row justify-center">
          <div class="content-fixed-width">
            <!--            <q-banner v-if="isBannerOn" class="col  q-mt-lg banner-border shadow-5" inline-actions>-->
            <!--              <template v-slot:action>-->
            <!--                <q-btn flat padding="none" color="primary" label="忽略" @click="isBannerOn=false"/>-->
            <!--              </template>-->
            <!--              <div>-->
            <!--                <q-btn class="text-h6" flat padding="none" color="primary" :to="{path: '/news/center-beta'}">-->
            <!--                  中国科技云联邦试用公告-->
            <!--                </q-btn>-->
            <!--              </div>-->
            <!--            </q-banner>-->
          </div>
        </div>
      </div>

      <div class="col-auto">
        <div class="row justify-center">
          <div class="content-fixed-width">

            <div class="column">
              <div class="col">
                <div class="row">

                  <div class="col q-pt-lg q-mr-md ">
                    <q-tabs
                      v-model="tab1"
                      active-color="black"
                      active-bg-color=""
                      indicator-color="primary"
                      align="left"
                      narrow-indicator
                    >
                      <q-tab class="q-px-sm text-h6 " name="fed">联邦成员</q-tab>
                      <q-tab class="q-px-sm text-h6 " name="sum">资源汇聚</q-tab>
                    </q-tabs>

                    <q-tab-panels v-model="tab1" class="non-selectable overflow-hidden">
                      <q-tab-panel name="fed" class="tab1" style="overflow: hidden;">
                        <bei-jing-chart :option="option" style="width: 600px; height: 195px"></bei-jing-chart>
                        <div class="row justify-start items-center q-gutter-lg">
                          <div class="col-auto row items-end">
                            当前机构数量：
                            <span>
                              <q-btn flat dense padding="none" :to="{path:'/my/federation/resource'}">
                                 <div class="text-primary text-h4">
                                   {{ $store.state.fed.tables.dataCenterTable.allIds?.length }}
                                 </div>
                              </q-btn>
                            </span>
                          </div>
                          <div class="col-auto row items-end">
                            当前服务数量：
                            <span>
                              <q-btn flat dense padding="none" :to="{path:'/my/federation/resource'}">
                                 <div class="text-primary text-h4">
                                   {{ $store.state.fed.tables.serviceTable.allIds?.length }}
                                 </div>
                              </q-btn>
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

                        <!--                        <q-item clickable to="/news/center-beta">-->
                        <!--                          <q-item-section>-->
                        <!--                            <div class="row justify-between">-->
                        <!--                              <div class="col-auto">中国科技云联邦进行网络中心试用</div>-->
                        <!--                              <div class="col-auto">2021-10-26</div>-->
                        <!--                            </div>-->
                        <!--                          </q-item-section>-->
                        <!--                        </q-item>-->
                        <q-item clickable>
                          <q-item-section>
                            <div class="row justify-between">
                              <div class="col-auto">中国科技云联邦进行网络中心试用</div>
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
                              <div class="col-auto">中国科技云联邦beta版本上线</div>
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

// import GlobalHeaderContent from 'components/Layout/GlobalHeaderContent.vue'
import ServerTable from 'components/Server/ServerTable.vue'
// import BucketTable from 'components/BucketTable/BucketTable.vue'
import GroupTable from 'components/Group/GroupTable.vue'
import BeiJingChart from 'components/Chart/BeiJingChart.vue'

export default defineComponent({
  name: 'Main',
  components: {
    // GlobalHeaderContent,
    ServerTable,
    // BucketTable,
    GroupTable,
    BeiJingChart
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
    const labelData = [
      {
        name: '怀柔区',
        value: 38.4,
        lng: 116.63853,
        lat: 40.322563
      },
      {
        name: '密云区',
        value: 47.9,
        lng: 116.849551,
        lat: 40.382999
      },
      {
        name: '昌平区',
        value: 196.3,
        lng: 116.237832,
        lat: 40.226854
      },
      {
        name: '顺义区',
        value: 102,
        lng: 116.663242,
        lat: 40.1362
      },
      {
        name: '平谷区',
        value: 42.3,
        lng: 117.128025,
        lat: 40.147115
      },
      {
        name: '门头沟区',
        value: 30.8,
        lng: 116.108179,
        lat: 39.94648
      },
      {
        name: '海淀区',
        value: 369.4,
        lng: 116.304872,
        lat: 39.96553
      },
      {
        name: '石景山区',
        value: 65.2,
        lng: 116.229612,
        lat: 39.912017
      },
      {
        name: '西城区',
        value: 129.8,
        lng: 116.372397,
        lat: 39.918561
      },
      {
        name: '东城区',
        value: 90.5,
        lng: 116.42272,
        lat: 39.934579
      },
      {
        name: '朝阳区',
        value: 395.5,
        lng: 116.449767,
        lat: 39.927254
      },
      {
        name: '大兴区',
        value: 156.2,
        lng: 116.348053,
        lat: 39.732833
      },
      {
        name: '房山区',
        value: 104.6,
        lng: 116.149892,
        lat: 39.755039
      },
      {
        name: '丰台区',
        value: 232.4,
        lng: 116.293105,
        lat: 39.865042
      },
      {
        name: '通州区',
        value: 42.3,
        lng: 116.662928,
        lat: 39.917001
      },
      {
        name: '延庆区',
        value: 42.3,
        lng: 115.981186,
        lat: 40.462706
      }
    ]
    const pointData = [
      {
        name: '中国科学院计算机网络信息中心',
        value: 8,
        LngAndLat: [116.342428, 39.99322]
      },
      {
        name: '地球大数据科学工程专项',
        value: 8,
        LngAndLat: [116.63853, 40.322563]
      }
    ]
    const convertData = function (data: any) {
      const res = []
      for (let i = 0; i < data.length; i++) {
        const geoCoord = data[i].LngAndLat
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          })
        }
      }
      return res
    }
    const option = computed(() => ({
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: '{b}'
      },
      geo: {
        map: 'bj',
        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: false
          }
        },
        roam: false,
        itemStyle: {
          normal: {
            areaColor: '#ECEFF4',
            borderColor: '#4C566A'
          },
          emphasis: {
            areaColor: '#2B91B7'
          }
        },
        zoom: 1.2
      },
      series: [{
        name: '机构',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: convertData(pointData),
        symbolSize: function (val: number[]) {
          return val[2]
        },
        showEffectOn: 'emphasis',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        label: {
          normal: {
            show: true,
            position: 'left',
            formatter: function (params: any) {
              return params.name
            },
            lineHeight: 10,
            backgroundColor: '#fafafa',
            borderColor: '#31CCEC',
            borderWidth: '1',
            borderRadius: 5,
            padding: [7, 5, 7],
            color: '#1d1d1d',
            fontSize: 12,
            fontWeight: 'normal'
          },
          emphasis: {
            show: true
          }
        },
        itemStyle: {
          normal: {
            color: '#027BE3'
          }
        }
      },
      {
        name: '机构数',
        type: 'map',
        mapType: 'bj',
        geoIndex: 0,
        itemStyle: {
          normal: { label: { show: true } },
          emphasis: { label: { show: true } }
        },
        data: labelData
      }]
    }))
    return {
      $store,
      currentUser,
      tab1,
      tab2,
      servers,
      groups,
      // buckets,
      isBannerOn,
      option
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
  //background-image: url('/img/city_map.png');
  //background-repeat: no-repeat;
  //background-size: auto;
  height: 248px;
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
