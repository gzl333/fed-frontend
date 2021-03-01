<template>
  <div class="CostDetails">
    <q-card flat bordered class="my-card">
      <q-card-section class="bg-teal text-white">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6 text-weight-bold">费用概览</div>
          </div>
          <div class="col-auto">
            <q-btn flat label="全部资源"> </q-btn>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-splitter v-model="splitterModel" style="height: 350px">
          <template v-slot:before>
            <q-tabs v-model="tab" vertical class="text-teal">
              <q-tab name="week" icon="mail" label="最近一周" />
              <q-tab name="month" icon="alarm" label="最近一个月" />
              <q-tab name="threeMonth" icon="movie" label="最近三个月" />
              <q-tab
                name="sixMonth"
                icon="slow_motion_video"
                label="最近半年"
              />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels
              v-model="tab"
              animated
              swipeable
              vertical
              transition-prev="jump-up"
              transition-next="jump-up"
            >
              <q-tab-panel name="week">
                <div class="text-h6 text-weight-bold q-mb-md">最近一周</div>
                <q-list padding>
                  <q-item>
                    <q-item-section>
                      <q-item-label>包年合同</q-item-label>
                      <q-item-label caption>
                        使用时长：200小时；合同时效：2年
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>包月合同</q-item-label>
                      <q-item-label caption>
                        使用时长：150小时；合同时效：3个月
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>按量付费</q-item-label>
                      <q-item-label caption>
                        使用时长：100小时；费用：￥1200.00
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-tab-panel>

              <q-tab-panel name="month">
                <div class="text-h6 text-weight-bold q-mb-md">最近一个月</div>
                <q-list padding>
                  <q-item v-ripple>
                    <q-item-section>
                      <q-item-label>按量付费</q-item-label>
                      <q-item-label caption>
                        使用时长：100小时；费用：￥1200.00
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-tab-panel>
              <q-tab-panel name="threeMonth">
                <div class="text-h6 text-weight-bold q-mb-md">最近三个月</div>
                <q-list padding>
                  <q-item v-ripple>
                    <q-item-section>
                      <q-item-label>按量付费</q-item-label>
                      <q-item-label caption>
                        使用时长：100小时；费用：￥1200.00
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-ripple>
                    <q-item-section>
                      <q-item-label>试用配额</q-item-label>
                      <q-item-label caption> 试用时长：5个月 </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-tab-panel>
              <q-tab-panel name="sixMonth">
                <div class="text-h6 text-weight-bold q-mb-md">最近半年</div>
                <q-list padding>
                  <q-item v-ripple>
                    <q-item-section>
                      <q-item-label>按量付费</q-item-label>
                      <q-item-label caption>
                        使用时长：100小时；费用：￥1200.00
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-ripple>
                    <q-item-section>
                      <q-item-label>试用配额</q-item-label>
                      <q-item-label caption> 试用时长：5个月 </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'CostDetails',
  components: {
  },
  props: {
  },
  setup () {
    return {
      tab: ref('week'),
      splitterModel: ref(20)

    }
  }
})
</script>

<style lang="scss" scoped>
.CostDetails {
}
.my-card {
  width: 100%;
}
</style>
