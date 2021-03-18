<template>
  <div class="QuickEntry">
    <q-card flat bordered class="my-card">
      <q-card-section class="bg-nord8 text-white">
        <div class="text-h6 text-weight-bold">快捷入口</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row items-center no-wrap q-pl-xl">
          <div class="col-3">
            <div>
              <q-btn flat :to="{ path: '/my/usage/vmcreate' }">
                <q-icon style="font-size: 5em"
                  ><i class="fas fa-tv"></i
                ></q-icon>
              </q-btn>
            </div>
            <div>
              <q-btn
                flat
                label="创建云主机"
                :to="{ path: '/my/usage/vmcreate' }"
              ></q-btn>
            </div>
          </div>
          <div class="col-3">
            <div>
              <q-btn flat disable>
                <q-icon style="font-size: 5em"
                  ><i class="fas fa-cog"></i
                ></q-icon>
              </q-btn>
            </div>
            <div>
              <q-btn flat disable label="VPN配置"></q-btn>
            </div>
          </div>
          <div class="col-3">
            <div>
              <q-btn flat disable>
                <q-icon style="font-size: 5em"
                  ><i class="fas fa-wrench"></i
                ></q-icon>
              </q-btn>
            </div>
            <div>
              <q-btn flat disable label="工单中心"></q-btn>
            </div>
          </div>
          <div class="col-3">
            <div>
              <q-btn flat disable>
                <q-icon style="font-size: 5em"
                  ><i class="fas fa-yen-sign"></i
                ></q-icon>
              </q-btn>
            </div>
            <div>
              <q-btn flat disable label="计费中心"></q-btn>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
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
  height: 210px;
}
</style>
