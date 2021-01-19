<template>
  <div style="margin-top: 15px">
    <div v-if="caller === 'vm'">
      <el-input
        placeholder="请输入关键字进行模糊搜索"
        v-model="input"
        class="input-with-select"
      >
        <template #append>
          <el-button icon="el-icon-search"></el-button>
        </template>
      </el-input>
      <el-button
        @click="gotoSubview('vmadvsearch')"
        icon="el-icon-arrow-down"
        type="primary"
        plain
      >
        云服务器高级搜索
      </el-button>
      for dev: {{ input }}
    </div>
    <div v-if="caller === 'disk'">
      <el-input
        placeholder="请输入关键字进行模糊搜索"
        v-model="input"
        class="input-with-select"
      >
        <template #append>
          <el-button icon="el-icon-search"></el-button>
        </template>
      </el-input>
      <el-button
        @click="gotoSubview('vmadvsearch')"
        icon="el-icon-arrow-down"
        type="primary"
        plain
      >
        云硬盘高级搜索
      </el-button>
      for dev: {{ input }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps, Subview } from '@/store/index.ts'

export default defineComponent({
  name: 'GlobalSearchBar',
  components: {
  },
  props: {
    caller: {
      type: String,
      required: true
    }
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const gotoSubview = (subview: Subview) => store.commit('gotoSubview', subview)
    return {
      input: ref(''),
      gotoSubview
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
