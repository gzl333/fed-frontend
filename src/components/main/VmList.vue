<template>
  <div class="VmList">
    <!-- 适配大屏 -->
    <div class="my-card-big gt-sm">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6 text-weight-bold">云主机</div>
          </div>
          <div class="col-auto">
            <q-input
              dense
              standout
              v-model="searchContent"
              input-class="text-right"
              class="q-ml-sm"
              type="search"
            >
              <template v-slot:append>
                <q-icon v-if="searchContent === ''" name="search" />
                <q-icon
                  v-else
                  name="clear"
                  class="cursor-pointer"
                  @click="searchContent = ''"
                />
              </template>
            </q-input>
          </div>
          <div class="col-auto">
            <q-btn
              color="nord8"
              label="全部云主机"
              dense
              unelevated
              flat
              class="q-ml-md"
              :to="{ path: '/my/usage/vm' }"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator />

      <div v-if="searchContent === ''" style="font-size: 0.9em">
        <div class="q-py-md q-px-lg flex flex-center">
          第 {{ paginationSelected }} 页 ，共 {{ pageCount }} 页
          <q-space />

          <q-pagination
            v-model="paginationSelected"
            :max="pageCount"
            :direction-links="true"
            color="nord8"
          >
          </q-pagination>
        </div>
        <div v-if="serverList === null">由于网络问题，无法获取云主机</div>
        <div v-else class="row items-center wrap q-px-xl q-gutter-lg">
          <div v-for="(item, index) in serverList" :key="index">
            <div class="col">
              <q-card flat class="every-card-big">
                <q-card-section horizontal>
                  <q-card-section class="col flex flex-center">
                    <q-chip v-if="!item.status" label="读取中" square>
                      <q-inner-loading showing class="inner-loading">
                        <q-spinner color="nord9" />
                      </q-inner-loading>
                    </q-chip>
                    <div v-if="item.status == '运行中'">
                      <q-btn
                        flat
                        v-if="item.status == '运行中'"
                        @click="gotoVNC(item.id)"
                      >
                        <q-icon size="3em" name="computer"></q-icon>
                        <q-tooltip>点击进入VNC</q-tooltip></q-btn
                      >
                    </div>
                    <div v-if="item.status == '已关机'">
                      <q-icon style="font-size: 3em"
                        ><i class="fas fa-times"
                          ><q-tooltip>请开机以使用VNC</q-tooltip></i
                        ></q-icon
                      >
                    </div>
                    <div>
                      {{ item.ipv4 }}
                    </div>
                  </q-card-section>

                  <q-card-section class="text-white">
                    <div>
                      <q-btn
                        v-if="
                          item.status !== '运行中' && item.status !== '已关机'
                        "
                        loading
                        color="nord8"
                        label="1"
                        style="font-size: 0.5em"
                      >
                      </q-btn>
                      <q-btn
                        v-if="item.status == '运行中'"
                        color="nord8"
                        label="关机"
                        unelevated
                        dense
                        style="font-size: 0.9em"
                        @click="
                          vmOperation({
                            endPoint: item.endpoint_url,
                            id: item.id,
                            action: 'shutdown',
                          })
                        "
                      />

                      <q-btn
                        v-if="item.status == '已关机'"
                        color="nord8"
                        label="开机"
                        unelevated
                        dense
                        style="font-size: 0.9em"
                        @click="
                          vmOperation({
                            endPoint: item.endpoint_url,
                            id: item.id,
                            action: 'start',
                          })
                        "
                      />
                    </div>
                    <div>
                      <q-btn
                        color="nord8"
                        label="VPN"
                        dense
                        unelevated
                        disable
                        style="font-size: 0.9em"
                      />
                    </div>
                    <div>
                      <q-btn
                        color="nord8"
                        label="详情"
                        dense
                        unelevated
                        style="font-size: 0.9em"
                        :to="{ path: '/my/usage/vmdetail' }"
                        @click="more(item.id)"
                      />
                    </div>
                  </q-card-section>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 适配手机 -->
    <div class="my-card-small lt-md">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6 text-weight-bold">云主机</div>
          </div>
          <div class="col-auto gt-xs">
            <q-input
              borderless
              dense
              debounce="300"
              v-model="searchContent"
              placeholder="Search"
              class="q-ml-sm"
            >
              <template v-slot:append>
                <q-icon name="search" />
                <!-- <q-icon v-if="searchContent === ''" name="search" />
                <q-icon
                  v-else
                  name="clear"
                  class="cursor-pointer"
                  @click="searchContent = ''"
                /> -->
              </template>
            </q-input>
          </div>
          <div class="col-auto">
            <q-btn
              color="nord8"
              label="全部云主机"
              dense
              unelevated
              flat
              class="q-ml-md"
              :to="{ path: '/my/usage/vm' }"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator />

      <div v-if="searchContent === ''" style="font-size: 0.9em">
        <div class="q-py-md q-px-lg flex flex-center">
          第 {{ paginationSelected }} 页 ，共 {{ pageCount }} 页
          <q-space />

          <q-pagination
            v-model="paginationSelected"
            :max="pageCount"
            :direction-links="true"
            color="nord8"
          >
          </q-pagination>
        </div>
        <div v-if="serverList === null">由于网络问题，无法获取云主机</div>
        <div v-else class="row items-center wrap">
          <div v-for="(item, index) in serverList" :key="index">
            <div class="col">
              <q-card flat class="every-card-small">
                <q-card-section horizontal>
                  <q-card-section class="col flex flex-center">
                    <q-chip v-if="!item.status" label="读取中" square>
                      <q-inner-loading showing class="inner-loading">
                        <q-spinner color="nord9" />
                      </q-inner-loading>
                    </q-chip>
                    <div v-if="item.status == '运行中'">
                      <q-btn
                        flat
                        v-if="item.status == '运行中'"
                        @click="gotoVNC(item.id)"
                      >
                        <q-icon size="3em" name="computer"></q-icon>
                        <q-tooltip>点击进入VNC</q-tooltip></q-btn
                      >
                    </div>
                    <div v-if="item.status == '已关机'">
                      <q-icon style="font-size: 3em"
                        ><i class="fas fa-times"
                          ><q-tooltip>请开机以使用VNC</q-tooltip></i
                        ></q-icon
                      >
                    </div>
                    <div>
                      {{ item.ipv4 }}
                    </div>
                  </q-card-section>

                  <q-card-section class="text-white">
                    <div>
                      <q-btn
                        v-if="
                          item.status !== '运行中' && item.status !== '已关机'
                        "
                        loading
                        color="nord8"
                        label="1"
                        style="font-size: 0.5em"
                      >
                      </q-btn>
                      <q-btn
                        v-if="item.status == '运行中'"
                        color="nord8"
                        label="关机"
                        unelevated
                        dense
                        style="font-size: 0.9em"
                        @click="
                          vmOperation({
                            endPoint: item.endpoint_url,
                            id: item.id,
                            action: 'shutdown',
                          })
                        "
                      />

                      <q-btn
                        v-if="item.status == '已关机'"
                        color="nord8"
                        label="开机"
                        unelevated
                        dense
                        style="font-size: 0.9em"
                        @click="
                          vmOperation({
                            endPoint: item.endpoint_url,
                            id: item.id,
                            action: 'start',
                          })
                        "
                      />
                    </div>
                    <div>
                      <q-btn
                        color="nord8"
                        label="VPN"
                        dense
                        unelevated
                        disable
                        style="font-size: 0.9em"
                      />
                    </div>
                    <div>
                      <q-btn
                        color="nord8"
                        label="详情"
                        dense
                        unelevated
                        style="font-size: 0.9em"
                        :to="{ path: '/my/usage/vmdetail' }"
                        @click="more(item.id)"
                      />
                    </div>
                  </q-card-section>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { StateInterface } from '../../store'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'VmList',
  components: {
  },
  props: {
  },
  setup () {
    // console.log('in setup')
    const searchContent = ref('')
    const $store = useStore<StateInterface>()

    $store.commit('quota/storePagination', {
      page: 1,
      pageSize: 9,
      serviceId: '0'
    })
    // console.log('$store.state.quota.pagination.pageSize:', $store.state.quota.pagination.pageSize)

    void $store.dispatch('quota/updateServerList')
    const serverList = computed(() => {
      return $store.state.quota.serverList
    })

    // console.log('$store.state.quota.pagination.count:', $store.state.quota.pagination.count)
    const pageCount = computed(() => {
      if ($store.state.quota.pagination.count && $store.state.quota.pagination.pageSize) {
        return Math.ceil($store.state.quota.pagination.count / $store.state.quota.pagination.pageSize)
      } else {
        return 1
      }
    })
    // console.log('pageCount:', pageCount)

    const paginationSelected = computed({
      get: () => $store.state.quota.pagination.page,
      set: (value) => {
        $store.commit('quota/storePagination', { page: value })
        void $store.dispatch('quota/updateServerList')
      }
    })

    // VNC
    const gotoVNC = async (payload: string) => {
      const response = await $store.dispatch('vm/fetchServerVNC', payload)
      const url = response.data.vnc.url
      window.open(url)
    }
    // 云主机操作
    const vmOperation = (payload: { endPoint: string; id: string; action: string; ip?: string }) => {
      void $store.dispatch('quota/vmOperation', payload) // 做开机/关机的操作
    }
    // more
    const more = (id: string) => {
      void $store.dispatch('vm/updateServerInfo', id)
      // console.log('$store.state.vm.serverDetail:', $store.state.vm.serverDetail)
    }
    return {
      serverList,
      gotoVNC,
      vmOperation,
      pageCount,
      paginationSelected,
      more,
      searchContent
    }
  }
})
</script>

<style lang="scss" scoped>
.VmList {
}
.my-card-big {
  width: 100%;
  // height: calc(100vh - 114px - 28vh);
  height: 580px;
  // font-size: 1vw;
  width: 41.666666667vw;
}
.every-card-big {
  width: 100%;
  // width: calc(100vw - 165px - 81vw);
  // height: calc(100vh - 114px - 74vh);
  width: 9.8958333vw;
  height: 130px;
  font-size: 0.83333333vw;
}
.inner-loading {
  background-color: transparent;
}

.my-card-small {
  width: 100%;
}
.every-card-small {
  width: 100%;
  width: 20vw;
}
</style>
