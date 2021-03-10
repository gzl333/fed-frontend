<template>
  <div class="GroupList">
    <q-card flat bordered class="my-card">
      <q-card-section class="bg-teal text-white">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6 text-weight-bold">我的组</div>
          </div>
          <div class="col-auto">
            <q-btn color="grey-7" round flat icon="more_vert"> </q-btn>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-splitter v-model="splitterModel" style="height: 350px">
          <template v-slot:before>
            <q-tabs v-model="tab" vertical class="text-teal">
              <q-tab name="a" icon="people" label="A组" />
              <q-tab name="b" icon="people" label="B组" />
              <q-tab name="c" icon="people" label="C组" />
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
              <q-tab-panel name="a">
                <div class="text-h6 text-weight-bold q-mb-md">A组</div>
                <div class="row items-top no-wrap q-ml-lg q-mt-lg">
                  <div class="col-3">组长</div>
                  <div class="col-9">张三</div>
                </div>
                <div class="row items-top no-wrap q-mt-lg q-ml-lg">
                  <div class="col-3">我的配额</div>
                  <div class="col-9">
                    <div class="q-mb-sm">CPU：50（剩余：45）</div>
                    <div class="q-mb-sm">内存：11111（剩余：40）</div>
                    <div class="q-mb-sm">硬盘：22222（剩余：40）</div>
                    <div class="q-mb-sm">公网IP：10（剩余：5）</div>
                    <div class="q-mb-lg">私网IP：10（剩余：6）</div>
                  </div>
                </div>
                <q-btn
                  style="background: goldenrod; color: white"
                  label="申请增加配额"
                  class="q-ml-xl"
                />
              </q-tab-panel>
              <q-tab-panel name="b">
                <div class="text-h6 text-weight-bold q-mb-md">B组</div>
                <div class="row items-top no-wrap q-ml-lg q-mt-lg">
                  <div class="col-3">组长</div>
                  <div class="col-9">张三</div>
                </div>
                <div class="row items-top no-wrap q-mt-lg q-ml-lg">
                  <div class="col-3">我的配额</div>
                  <div class="col-9">
                    <div class="q-mb-sm">CPU：50（剩余：45）</div>
                    <div class="q-mb-sm">内存：11111（剩余：40）</div>
                    <div class="q-mb-sm">硬盘：22222（剩余：40）</div>
                    <div class="q-mb-sm">公网IP：10（剩余：5）</div>
                    <div class="q-mb-lg">私网IP：10（剩余：6）</div>
                  </div>
                </div>
                <q-btn
                  style="background: goldenrod; color: white"
                  label="申请增加配额"
                  class="q-ml-xl"
                />
              </q-tab-panel>
              <q-tab-panel name="c">
                <div class="text-h6 text-weight-bold q-mb-md">C组</div>
                <div class="row items-top no-wrap q-ml-lg q-mt-lg">
                  <div class="col-3">组长</div>
                  <div class="col-9">张三</div>
                </div>
                <div class="row items-top no-wrap q-mt-lg q-ml-lg">
                  <div class="col-3">我的配额</div>
                  <div class="col-9">
                    <div class="q-mb-sm">CPU：50（剩余：45）</div>
                    <div class="q-mb-sm">内存：11111（剩余：40）</div>
                    <div class="q-mb-sm">硬盘：22222（剩余：40）</div>
                    <div class="q-mb-sm">公网IP：10（剩余：5）</div>
                    <div class="q-mb-lg">私网IP：10（剩余：6）</div>
                  </div>
                </div>
                <q-btn
                  style="background: goldenrod; color: white"
                  label="申请增加配额"
                  class="q-ml-xl"
                />
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
  name: 'GroupList',
  components: {
  },
  props: {
  },
  setup () {
    return {
      tab: ref('a'),
      splitterModel: ref(15)
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupList {
}
.my-card {
  width: 100%;
}
</style>
