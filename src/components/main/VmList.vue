<template>
  <div class="VmList">
    <q-card flat bordered class="my-card">
      <q-card-section class="bg-nord8 text-white">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6 text-weight-bold">云主机</div>
          </div>
          <div class="col-auto">
            <q-input
              dark
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
              class="text-white q-ml-md"
              :to="{ path: '/my/usage/vm' }"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section v-if="searchContent !== ''" class="height: 650px;">
      </q-card-section>
      <q-card-section v-if="searchContent === ''" class="height: 650px;">
        <div class="q-pl-lg q-pr-lg flex flex-center">
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
        <div class="row items-center wrap q-ml-xl q-mt-lg">
          <div v-for="(item, index) in serverList" :key="index">
            <div class="col-4 every-card q-ml-lg">
              <q-card flat>
                <q-card-section horizontal>
                  <q-card-section class="col-5 flex flex-center">
                    <q-chip v-if="!item.status" label="读取中" square>
                      <q-inner-loading showing class="inner-loading">
                        <q-spinner size="30px" color="nord9" />
                      </q-inner-loading>
                    </q-chip>
                    <div v-if="item.status == '运行中'">
                      <q-btn
                        flat
                        v-if="item.status == '运行中'"
                        @click="gotoVNC(item.id)"
                      >
                        <q-icon size="4em" name="computer"></q-icon>
                        <q-tooltip>点击进入VNC</q-tooltip></q-btn
                      >
                    </div>
                    <div v-if="item.status == '已关机'">
                      <q-icon style="font-size: 5em"
                        ><i class="fas fa-times"
                          ><q-tooltip>请开机以使用VNC</q-tooltip></i
                        ></q-icon
                      >
                    </div>
                    <div class="text-subtitle2 q-mt-xs">
                      {{ item.ipv4 }}
                    </div>
                  </q-card-section>
                  <q-card-section class="text-white q-ml-xs">
                    <div>
                      <q-btn
                        v-if="
                          item.status !== '运行中' && item.status !== '已关机'
                        "
                        loading
                        color="nord8"
                        label="."
                      >
                      </q-btn>
                      <q-btn
                        v-if="item.status == '运行中'"
                        color="nord8"
                        label="关机"
                        unelevated
                        dense
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
                        disable
                        label="VPN"
                        dense
                        unelevated
                      />
                    </div>
                    <div>
                      <q-btn
                        color="nord8"
                        label="详情"
                        dense
                        unelevated
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
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { StateInterface } from '../../store'
import { useStore } from 'vuex'
import { ServerInterface } from '../../store/usage/state'

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

    // 搜索结果列表
    const resultServerList: ServerInterface[] = []
    serverList.value.filter((item) => {
      if (item.ipv4) {
        if (item.ipv4.indexOf(searchContent.value) !== -1) {
          resultServerList.push(item)
          console.log('searchContent:', searchContent.value)
        }
      }
      console.log('search:', resultServerList)
      return resultServerList
    })

    // VNC
    const gotoVNC = async (payload: string) => {
      const response = await $store.dispatch('usage/fetchServerVNC', payload)
      const url = response.data.vnc.url
      window.open(url)
    }
    // 云主机操作
    const vmOperation = (payload: { endPoint: string; id: string; action: string; ip?: string }) => {
      void $store.dispatch('usage/vmOperation', payload)
    }
    // more
    const more = (id: string) => {
      void $store.dispatch('usage/updateServerInfo', id)
      // console.log('$store.state.usage.serverDetail:', $store.state.usage.serverDetail)
    }
    return {
      serverList,
      gotoVNC,
      vmOperation,
      pageCount,
      paginationSelected,
      more,
      searchContent,
      resultServerList
    }
  }
})
</script>

<style lang="scss" scoped>
.VmList {
}
.my-card {
  width: 100%;
  height: 590px;
}
.every-card {
  width: 100%;
  max-width: 200px;
}
.inner-loading {
  background-color: transparent;
}
</style>
