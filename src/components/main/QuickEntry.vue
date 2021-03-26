<template>
  <div class="QuickEntry">
    <div class="my-card">
      <q-card-section>
        <div class="text-h6 text-weight-bold">快捷入口</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row gt-sm items-center no-wrap q-pl-xl">
          <div class="col-3">
            <div>
              <q-btn flat :to="{ path: '/my/usage/vmcreate' }">
                <q-icon style="font-size: 3em"
                  ><i class="fas fa-tv"></i
                ></q-icon>
              </q-btn>
            </div>
            <div>
              <q-btn
                style="font-size: 0.85em"
                flat
                label="创建云主机"
                :to="{ path: '/my/usage/vmcreate' }"
              ></q-btn>
            </div>
          </div>
          <div class="col-3">
            <div>
              <q-btn flat disable>
                <q-icon style="font-size: 3em"
                  ><i class="fas fa-archive"></i
                ></q-icon>
              </q-btn>
            </div>
            <div>
              <q-btn
                style="font-size: 0.85em"
                flat
                disable
                label="创建存储桶"
              ></q-btn>
            </div>
          </div>
          <div class="col-3">
            <div>
              <q-btn flat disable>
                <q-icon style="font-size: 3em"
                  ><i class="fas fa-wrench"></i
                ></q-icon>
              </q-btn>
            </div>
            <div>
              <q-btn
                style="font-size: 0.85em"
                flat
                disable
                label="工单中心"
              ></q-btn>
            </div>
          </div>
          <div class="col-3">
            <div>
              <q-btn flat disable>
                <q-icon style="font-size: 3em"
                  ><i class="fas fa-yen-sign"></i
                ></q-icon>
              </q-btn>
            </div>
            <div>
              <q-btn
                style="font-size: 0.85em"
                flat
                disable
                label="计费中心"
              ></q-btn>
            </div>
          </div>
        </div>
      </q-card-section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'QuickEntry',
  components: {
  },
  props: {
  },
  setup () {
    return {

    }
  }
})
</script>

<style lang="scss" scoped>
.QuickEntry {
}
.my-card {
  width: 100%;
  // height: calc(100vh - 114px - 67vh);
  height: 216px;
  font-size: 1vw;
  width: 41.666666667vw;
  // width: calc(0.41666667 * 100vw);
}
</style>
