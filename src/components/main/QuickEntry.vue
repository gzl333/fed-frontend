<template>
  <div class="QuickEntry">
    <q-card flat bordered class="my-card">
      <q-card-section class="bg-secondary text-nord6">
        <div class="text-h6 text-weight-bold">快捷入口</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row items-center wrap q-gutter-sm">
          <div
            class="col"
            v-for="{ title, img } in entryList"
            :key="(title, img)"
          >
            <q-img
              src="https://cdn.quasar.dev/img/parallax2.jpg"
              style="height: 108px; max-width: 150px"
            >
              <div
                class="absolute-full text-subtitle2 flex flex-center text-weight-bold"
              >
                {{ title }}
              </div>
            </q-img>
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
    const entryList = [{
      title: '创建云主机',
      img: 'fas fa-server'
    },
    {
      title: 'VPN配置',
      img: 'fas fa-cog'
    },
    {
      title: '工单中心',
      img: 'fas fa-wrench'
    },
    {
      title: '计费中心',
      img: 'fas fa-yen-sign'
    }]
    return {
      entryList
    }
  }
})
</script>

<style lang="scss" scoped>
.QuickEntry {
}
.my-card {
  width: 100%;
}
</style>
