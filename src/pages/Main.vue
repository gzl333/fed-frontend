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

                    <q-tab-panels v-model="tab1" animated>
                      <q-tab-panel name="fed" class="">
                        地图
                      </q-tab-panel>

                      <q-tab-panel name="sum" class="">
                        汇聚图
                      </q-tab-panel>
                    </q-tab-panels>
                  </div>

                  <div class="col q-pt-lg">
                    <div class="row justify-between q-pt-sm q-px-sm">
                      <div class="col-auto">
                        <div class="text-h6 ">
                          云联邦动态
                        </div>
                      </div>
                      <div class="col-auto">
                        <q-btn flat color="primary"  label="更多动态"/>
                      </div>
                    </div>

                    <div>
                      <q-list dense bordered padding class="rounded-borders q-mt-sm">
                        <q-item clickable>
                          <q-item-section>
                            云联邦系统新闻1
                          </q-item-section>
                        </q-item>
                        <q-item clickable>
                          <q-item-section>
                            云联邦系统新闻2
                          </q-item-section>
                        </q-item>
                        <q-item clickable>
                          <q-item-section>
                            云联邦系统新闻3
                          </q-item-section>
                        </q-item>
                        <q-item clickable>
                          <q-item-section>
                            云联邦系统新闻4
                          </q-item-section>
                        </q-item>
                        <q-item clickable>
                          <q-item-section>
                            云联邦系统新闻5
                          </q-item-section>
                        </q-item>

                      </q-list>
                    </div>
                  </div>

                </div>
              </div>
              <div class="col">
                <div class="row q-mt-md justify-between ">
                  <div class=" col q-pa-sm text-h6">{{ $t('云主机') }}</div>
                </div>
                <q-separator/>
                <ServerTable v-if="servers" :vms="servers"/>
                <div v-else>暂无云主机</div>
              </div>

              <div class="col">
                <div class="row q-mt-md  text-h5 ">
                  <div class="q-pa-sm text-h6 ">{{ $t('对象存储') }}</div>
                </div>
                <q-separator/>
                <BucketTable v-if="buckets" :buckets="buckets"/>
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
import { StateInterface } from '../store'

import GlobalHeader from 'components/GlobalHeader.vue'
import ServerTable from 'components/ServerTable/ServerTable.vue'
import BucketTable from 'components/BucketTable/BucketTable.vue'

export default defineComponent({
  name: 'Main',
  components: {
    GlobalHeader,
    ServerTable,
    BucketTable
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const currentUser = $store.state.account.cstTrueName

    const tab1 = ref('fed')
    const tab2 = ref('')

    // 获取云主机列表数据
    const servers = computed(() => $store.getters['vm/getServers'].slice(0, 3))

    // 获取对象存储桶数据列表，目前是测试数据
    const buckets = [{
      bucketName: '测试桶1',
      domainName: 'obs.cstcloud.cn',
      count: 100,
      volume: '20GB',
      status: true,
      writeRead: 'pass1',
      readonly: 'pass1-1',
      creation: '2021-6-21 15:37'
    },
    {
      bucketName: '测试桶2',
      domainName: 'obs.cstcloud.cn',
      count: 289,
      volume: '300GB',
      status: false,
      writeRead: 'pass2',
      readonly: 'pass2-1',
      creation: '2021-6-21 15:37'
    },
    {
      bucketName: '测试桶3',
      domainName: 'obs.cstcloud.cn',
      count: 500,
      volume: '600GB',
      status: true,
      writeRead: 'pass3',
      readonly: 'pass3-1',
      creation: '2021-6-21 15:37'
    }]

    return {
      currentUser,
      tab1,
      tab2,
      servers,
      buckets
    }
  }
})
</script>

<style lang="scss" scoped>
.Main {
}

</style>
