<template>
  <div style="margin-top: 15px">
    <el-input
      placeholder="请输入关键字进行模糊搜索"
      v-model="input"
      class="input-with-select"
    >
      <template #append>
        <el-button icon="el-icon-search"></el-button>
      </template>
    </el-input>
    <el-button icon="el-icon-arrow-down" type="primary" plain>
      高级搜索
    </el-button>
    for dev: {{ input }}
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'GlobalSearchBar',
  components: {
  },
  props: {
  },
  setup () {
    return {
      input: ref('')
    }
  }
})
</script>

<style>
.el-select .el-input {
  width: 30px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.el-input-group {
  width: 400px;
}
</style>
