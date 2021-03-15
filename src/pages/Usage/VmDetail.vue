<template>
  <div class="VmDetail">
    <div class="column items-center justify-center routerview-area">
      <div class="col-1 self-start title-area">
        <div>
          <q-btn icon="arrow_back_ios_new" color="primary" flat unelevated dense :to="{path: '/my/usage/'}"/>
          云主机详情
        </div>
      </div>
      <q-spinner
        v-if="serverDetail === {}"
        color="primary"
        size="3em"
        :thickness="2"
      />
      <div class="col content-area">
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
              数据中心： {{ serverDetail.name }}
            </div>
            <div>
              服务类型： {{ serverDetail.service_type }}
            </div>
            <div>
              备注： {{ serverDetail.remarks }}
            </div>
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
    // 进入vm详情页面时， serverDetail中： id='0'是直接进入页面，应重定向；id=''是在读取中，应loading，其它状态则显示信息
    if (serverDetail.value.id === '0') {
      void $router.push({ path: '/my/usage/' })
    }
    return {
      serverDetail

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

.content-area {
  width: calc(100vw - 200px);
  margin-left: 120px;
}

.ip-title {
  font-size: large;
  font-weight: bold;
}
</style>
