<template>
  <div class="SearchBar">
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
      <router-link :to="{ name: 'vmsearch' }">
        <el-button icon="el-icon-arrow-down" type="primary" plain>
          高级搜索
        </el-button>
      </router-link>

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
      <router-link :to="{ name: 'disksearch' }">
        <el-button icon="el-icon-arrow-down" type="primary" plain>
          云硬盘高级搜索
        </el-button>
      </router-link>
      for dev: {{ input }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store/index.ts'

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
    return {
      input: ref('')
    }
  }
})
</script>

<style scoped>
.SearchBar {
  margin-top: 15px
}

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
