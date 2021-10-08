<template>
  <div class="FederationMonitorServer">
    <div v-for="(item, index) in data" :key="index" class="q-mt-lg">
    <div class="text-subtitle2 text-weight-bold">{{item.name}}</div>
    <div class="row q-mt-sm">
      <div class="col-2">
        <q-card flat bordered class="no-border-radius">
              <div class="row">
                <div class="col-11 text-center">主机数</div>
                <q-icon name="loop" class="col-1" size="xs"/>
              </div>
              <div class="text-center text-h4 text-weight-regular q-mt-sm q-pa-sm">{{ item.hostNumber }}</div>
        </q-card>
        <div class="row justify-between q-mt-sm">
          <q-card flat bordered class="no-border-radius col-6">
            <div class="col-11 text-center">在线</div>
            <div class="text-center text-h4 text-weight-regular text-positive q-mt-sm q-pa-sm">{{ item.onLine }}</div>
          </q-card>
          <q-card flat bordered class="no-border-radius col-6">
            <div class="col-11 text-center">掉线</div>
            <div class="text-center text-h4 text-weight-regular text-negative q-mt-sm q-pa-sm">{{ item.dropLine }}</div>
          </q-card>
        </div>
      </div>
      <div class="col-2 q-ml-md">
        <q-card flat bordered class="no-border-radius">
          <div class="row">
            <div class="col-11 text-center">集群状态</div>
            <q-icon name="loop" class="col-1" size="xs"/>
          </div>
          <div :class="item.clusterStatus === 'Healthy' ? 'text-positive text-center text-h4 text-weight-bold q-mt-lg q-pa-xl' : item.clusterStatus === 'Warning' ? 'text-warning text-center text-h4 text-weight-bold q-mt-lg q-pa-xl' : 'text-negative text-center text-h4 text-weight-bold q-mt-lg q-pa-xl'">{{ item.clusterStatus }}</div>
        </q-card>
      </div>
      <div class="col-2 q-ml-md">
        <q-card flat bordered class="no-border-radius">
          <div class="row">
            <div class="col-11 text-center">平均CPU使用率</div>
            <q-icon name="loop" class="col-1" size="xs"/>
          </div>
          <div class="text-center text-h4 text-weight-regular q-mt-sm q-pa-sm">{{ item.averageCPUUsage + '%' }}</div>
        </q-card>
        <div class="row justify-between q-mt-sm">
          <q-card flat bordered class="no-border-radius col-6">
            <div class="col-11 text-center">最大</div>
            <div class="text-center text-h5 q-mt-md q-pa-sm">{{ item.maxCPUUsage + '%' }}</div>
          </q-card>
          <q-card flat bordered class="no-border-radius col-6">
            <div class="col-11 text-center">最小</div>
            <div class="text-center text-h5 q-mt-md q-pa-sm">{{ item.minCPUUsage + '%' }}</div>
          </q-card>
        </div>
      </div>
      <div class="col-2 q-ml-md">
        <q-card flat bordered class="no-border-radius">
          <div class="row">
            <div class="col-11 text-center">平均内存使用率</div>
            <q-icon name="loop" class="col-1" size="xs"/>
          </div>
          <div class="text-center text-h4 text-weight-regular q-mt-sm q-pa-sm">{{ item.averageMemoryUsage + '%' }}</div>
        </q-card>
        <div class="row justify-between q-mt-sm">
          <q-card flat bordered class="no-border-radius col-6">
            <div class="col-11 text-center">最大</div>
            <div class="text-center text-h5 q-mt-md q-pa-sm">{{ item.maxMemoryUsage + '%' }}</div>
          </q-card>
          <q-card flat bordered class="no-border-radius col-6">
            <div class="col-11 text-center">最小</div>
            <div class="text-center text-h5 q-mt-md q-pa-sm">{{ item.minMemoryUsage + '%' }}</div>
          </q-card>
        </div>
      </div>
      <div class="col-2 q-ml-md">
        <q-card flat bordered class="no-border-radius">
          <div class="row">
            <div class="col-11 text-center">平均磁盘使用率</div>
            <q-icon name="loop" class="col-1" size="xs"/>
          </div>
          <div class="text-center text-h4 text-weight-regular q-mt-sm q-pa-sm">{{ item.averageDiskUsage + '%' }}</div>
        </q-card>
        <div class="row justify-between q-mt-sm">
          <q-card flat bordered class="no-border-radius col-6">
            <div class="col-11 text-center">最大</div>
            <div class="text-center text-h5 q-mt-md q-pa-sm">{{ item.maxDiskUsage + '%' }}</div>
          </q-card>
          <q-card flat bordered class="no-border-radius col-6">
            <div class="col-11 text-center">最小</div>
            <div class="text-center text-h5 q-mt-md q-pa-sm">{{ item.minDiskUsage + '%' }}</div>
          </q-card>
        </div>
      </div>
      <div class="col-1 q-ml-md">
        <q-card flat bordered class="no-border-radius q-pa-md">
            <div class="text-center q-mt-lg q-pb-sm q-pt-xs">
              <p class="text-primary">Go To</p>
              <p class="text-primary">Grafana</p>
              <p>详细信息</p>
            </div>
        </q-card>
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'FederationMonitorServer',
  components: {},
  props: {},
  setup () {
    const data = ref([
      {
        id: 0,
        name: '科技云联邦研发与运行（A所-上海）',
        hostNumber: 100,
        onLine: 99,
        dropLine: 1,
        clusterStatus: 'Healthy',
        averageCPUUsage: 2.8,
        maxCPUUsage: 3.0,
        minCPUUsage: 2.0,
        averageMemoryUsage: 27.2,
        maxMemoryUsage: 30.0,
        minMemoryUsage: 20.0,
        averageDiskUsage: 28.6,
        maxDiskUsage: 30.0,
        minDiskUsage: 20.0
      },
      {
        id: 1,
        name: '中国科技云智能运营（B所-北京）',
        hostNumber: 100,
        onLine: 99,
        dropLine: 1,
        clusterStatus: 'Warning',
        averageCPUUsage: 2.8,
        maxCPUUsage: 3.0,
        minCPUUsage: 2.0,
        averageMemoryUsage: 27.2,
        maxMemoryUsage: 30.0,
        minMemoryUsage: 20.0,
        averageDiskUsage: 28.6,
        maxDiskUsage: 30.0,
        minDiskUsage: 20.0
      },
      {
        id: 2,
        name: '国家基础学科公共科学数据中心（B所-上海）',
        hostNumber: 100,
        onLine: 99,
        dropLine: 1,
        clusterStatus: 'Healthy',
        averageCPUUsage: 2.8,
        maxCPUUsage: 3.0,
        minCPUUsage: 2.0,
        averageMemoryUsage: 27.2,
        maxMemoryUsage: 30.0,
        minMemoryUsage: 20.0,
        averageDiskUsage: 28.6,
        maxDiskUsage: 30.0,
        minDiskUsage: 20.0
      },
      {
        id: 3,
        name: '大规模对象存储（C所-北京）',
        hostNumber: 100,
        onLine: 99,
        dropLine: 1,
        clusterStatus: 'Healthy',
        averageCPUUsage: 2.8,
        maxCPUUsage: 3.0,
        minCPUUsage: 2.0,
        averageMemoryUsage: 27.2,
        maxMemoryUsage: 30.0,
        minMemoryUsage: 20.0,
        averageDiskUsage: 28.6,
        maxDiskUsage: 30.0,
        minDiskUsage: 20.0
      }
    ])
    return {
      data
    }
  }
})
</script>

<style lang="scss" scoped>
.FederationMonitorServer {
}
</style>
