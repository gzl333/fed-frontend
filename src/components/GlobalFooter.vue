<template>
  <div class="bg-dark footer-content">©CNIC 中国科学院计算机网络中心 2021</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Footer',
  components: {
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
.footer-content {
  min-height: 36px;
  font-family: "Microsoft YaHei";
  color: #ffffff;
}
.bg-dark {
  background: #040c20;
}
</style>
