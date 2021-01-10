<template>
  <div>this is Home</div>
  <div>走马灯</div>
  <div>资源与服务</div>
  <div>资源提供者</div>
  <div>开发者</div>
  <el-container>
    <el-footer style="padding: 0">
      <global-footer />
    </el-footer>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GlobalFooter from '@/components/GlobalFooter.vue'

export default defineComponent({
  name: 'Home',
  components: {
    GlobalFooter
  },
  props: {
  },
  setup () {
    return {
    }
  },
  data () {
    return {
    }
  },
  methods: {
  }
})
</script>

<style>
</style>
