<template>
  <el-menu
    default-active="vm"
    mode="horizontal"
    @select="handleSelect"
    class="usagenav"
  >
    <el-menu-item index="vm"> 云服务器 </el-menu-item>
    <el-menu-item index="disk"> 云硬盘 </el-menu-item>
    <el-menu-item index="obs"> 对象存储 </el-menu-item>
    <el-menu-item index="discovery"> 资源智能发现 </el-menu-item>
  </el-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'UsageNav',
  components: {
  },
  props: {
  },
  setup () {
    const router = useRouter()
    const handleSelect = (index: string) => {
      router.push({ name: index })
    }
    return {
      handleSelect
    }
  }
})
</script>

<style>
.usagenav > .el-menu-item {
  padding: 0 40px;
  /* border-right: solid 1px #eeeeee; */
}
.usagenav > .el-menu-item.is-active {
  border-bottom: 3px solid #409eff;
}
</style>
