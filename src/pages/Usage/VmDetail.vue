<template>
  <div class="VmDetail">
    <div class="column items-center justify-center routerview-area">
      <div class="col-1 self-start title-area">
        <div>
          云主机详情
          <q-btn class="back-btn" icon="arrow_back_ios_new" color="primary" flat unelevated dense :to="{path: '/my/usage/'}"/>
        </div>
      </div>

      <div v-if=" !serverDetail.ipv4" class="col content-area loading">
        <q-spinner
          color="primary"
          size="5em"
          :thickness="2"
        />
      </div>

      <div v-else class="col content-area">
        <div class="row">
          <div class="col-3 ip-title">
            {{ serverDetail.ipv4 }}
          </div>
        </div>
        <div class="row">
          <div class="col-4">
            <div>
              id： {{ serverDetail.id }}
            </div>
            <div>
              cpu： {{ serverDetail.vcpus }}
            </div>
            <div>
              内存： {{ serverDetail.ram }}
            </div>
            <div>
              系统镜像： {{ serverDetail.image }}
            </div>
            <div>
              创建时间： {{ serverDetail.creation_time }}
            </div>
            <div>
              数据中心： {{ serverDetail.service.name }}
            </div>
            <div>
              服务类型： {{ serverDetail.service.service_type }}
            </div>
            <div>
              备注： {{ serverDetail.remarks }}
            </div>
            <div>
              vpn: {{ vpnDetail }}
            </div>
            <pre>{{serverDetail}}</pre>
            <div>
              <!--              VPN： {{ vpn }}-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'VmDetail',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $router = useRouter()
    const serverDetail = computed(() => $store.state.usage.serverDetail)
    // 进入vm详情页面时， serverDetail中： id='0'是从url直接进入页面，而不是从vmlist点击进入，应重定向回vmlist；id=''是在读取中，应loading；其它状态则显示信息
    if (serverDetail.value.id === '0') {
      void $router.push({ path: '/my/usage/' })
    }
    // vpn
    const vpnDetail = computed(() => $store.state.usage.vpn.get(serverDetail.value.service!.id))

    return {
      serverDetail,
      vpnDetail
    }
  }
})
</script>

<style lang="scss" scoped>
.VmDetail {
}

.routerview-area {
  height: calc(100vh - 114px);
  width: calc(100vw - 165px);
}
.back-btn {
  left: -150px;
}
.title-area {
  width: 300px;
  margin-left: 140px;
  margin-bottom: calc((100vh - 114px) / 24);
  line-height: calc((100vh - 114px) / 10);
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
  border-bottom: $primary 2px solid;
}
.loading {
  line-height: 500px;
  text-align: center;
  margin-left: -140px;
}
.content-area {
  width: calc(100vw - 200px);
  margin-left: 140px;
}

.ip-title {
  font-size: large;
  font-weight: bold;
}
</style>
