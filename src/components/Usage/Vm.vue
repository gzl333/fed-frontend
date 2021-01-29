<template>
  <div class="Vm">
    <el-row>
      <el-col :span="4">
        <router-link :to="{ name: 'vmlist' }">
          <el-button
            v-if="
            (currentPosition === '创建云服务器') |
              (currentPosition === '云服务器搜索') |
              (currentPosition === '机构树')
          "
            type="primary"
            icon="el-icon-back"
            plain
          >
            返回云服务器列表
          </el-button>
        </router-link>
      </el-col>
      <el-col :span="16" class="searchbar">
        <search-bar caller="vm"/>
      </el-col>
      <el-col :span="4">
        <router-link :to="{ name: 'vmorgtree' }">
          <el-button type="primary" icon="el-icon-s-unfold" plain>
            机构树
          </el-button>
        </router-link>
        <router-link :to="{ name: 'vmcreate' }">
          <el-button type="success" icon="el-icon-plus"> 创建云服务器</el-button>
        </router-link>
      </el-col>
    </el-row>
    <div class="vm-router-view">
        <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store/index.ts'

import SearchBar from '@/components/Usage/SearchBar.vue'

export default defineComponent({
  name: 'Vm',
  components: {
    SearchBar
  },
  props: {},
  setup () {
    const store = useStore<GlobalDataProps>()
    const currentPosition = computed(() => store.state.position.slice(-1)[0])
    return {
      currentPosition
    }
  }
})
</script>

<style scoped>
.Vm {
}

.el-row {
  margin-bottom: 20px;

&
:last-child {
  margin-bottom: 0;
}

}
.el-col {
  border-radius: 4px;
}

.searchbar {
  margin-top: -14px;
}

.vm-router-view {
  /*height: calc(100vh - 288px);*/
  /*width: calc(100vw - 150px);*/
}
</style>
