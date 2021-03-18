<template>
  <div class="VmList">
    <q-card flat bordered class="my-card">
      <q-card-section class="bg-teal text-white">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6 text-weight-bold">云主机</div>
          </div>
          <div class="col-auto">
            <q-input
              dark
              dense
              standout
              v-model="text"
              input-class="text-right"
              class="q-ml-sm"
            >
              <template v-slot:append>
                <q-icon v-if="text === ''" name="search" />
                <q-icon
                  v-else
                  name="clear"
                  class="cursor-pointer"
                  @click="text = ''"
                />
              </template>
            </q-input>
          </div>
          <div class="col-auto">
            <router-link :to="`/my/usage/vm`" class="flat text-white q-ml-md"
              >全部云主机</router-link
            >
          </div>
        </div>
      </q-card-section>

      <q-card-section class="height: 650px;">
        <div class="q-pl-lg q-pr-lg flex flex-center">
          第 {{ paginationSelected }} 页 ，共 {{ pageCount }} 页
          <q-space />
          <q-pagination
            v-model="paginationSelected"
            :max="pageCount"
            :direction-links="true"
            :boundary-links="true"
            color="secondary"
          >
          </q-pagination>
        </div>
        <div class="row items-center wrap q-ml-xl">
          <div v-for="(item, index) in serverList" :key="index">
            <div class="col-4 every-card q-ml-lg">
              <q-card flat>
                <q-card-section horizontal>
                  <q-card-section class="col-5 flex flex-center">
                    <div v-if="item.status == '运行中'">
                      <q-icon style="font-size: 5em" class="text-nord14 q-mt-md"
                        ><i class="fas fa-tv">
                          <q-tooltip>点击进入VNC</q-tooltip></i
                        ></q-icon
                      >
                    </div>
                    <div v-if="item.status == '已关机'">
                      <q-icon style="font-size: 5em" class="text-nord14 q-mt-md"
                        ><i class="fas fa-times"
                          ><q-tooltip>请开机以使用VNC</q-tooltip></i
                        ></q-icon
                      >
                    </div>
                    <div class="text-subtitle2 q-mt-md">
                      {{ item.ipv4 }}
                    </div>
                  </q-card-section>
                  <q-card-section class="text-white">
                    <div>
                      <q-btn
                        v-if="item.status == '运行中'"
                        color="nord14"
                        label="VNC"
                        dense
                        unelevated
                        @click="gotoVNC(item.id)"
                      />
                      <q-btn
                        v-if="item.status == '已关机'"
                        color="nord4"
                        label="VNC"
                        disable
                        unelevated
                        dense
                      />
                    </div>
                    <div>
                      <q-btn
                        v-if="item.status == '运行中'"
                        color="nord14"
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
                        color="nord14"
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
                      <q-btn color="nord14" label="VPN" dense unelevated />
                    </div>
                    <div>
                      <q-btn color="nord14" label="更多" dense unelevated />
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
import { defineComponent, computed } from 'vue'
import { StateInterface } from '../../store'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'VmList',
  components: {
  },
  props: {
  },
  setup () {
    const $store = useStore<StateInterface>()

    // console.log('in setup')
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
      const response = await $store.dispatch('quota/fetchServerVNC', payload)
      const url = response.data.vnc.url
      window.open(url)
    }
    // 云主机操作
    const vmOperation = (payload: { endPoint: string; id: string; action: string; ip?: string }) => {
      void $store.dispatch('quota/vmOperation', payload)
    }

    return {
      serverList,
      gotoVNC,
      vmOperation,
      pageCount,
      paginationSelected
      // clickPrevious,
      // clickNext
    }
  }
})
</script>

<style lang="scss" scoped>
.VmList {
}
.my-card {
  width: 100%;
  height: 620px;
}
.every-card {
  width: 100%;
  max-width: 200px;
}
</style>
