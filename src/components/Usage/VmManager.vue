<template>
  <el-row>
    <el-col :span="4">
      <el-button
        v-if="
          (subview === 'orgtree') |
            (subview === 'vmadvsearch') |
            (subview === 'vmcreate')
        "
        @click="gotoSubview('vmlist')"
        type="primary"
        icon="el-icon-back"
        plain
      >
        返回云服务器列表
      </el-button>
    </el-col>
    <el-col :span="16" class="searchbar"> <search-bar caller="vm" /></el-col>
    <el-col :span="4">
      <el-button
        @click="gotoSubview('orgtree')"
        type="primary"
        icon="el-icon-s-unfold"
        plain
      >
        机构树
      </el-button>
      <el-button
        @click="gotoSubview('vmcreate')"
        type="success"
        icon="el-icon-plus"
      >
        创建云主机
      </el-button>
    </el-col>
  </el-row>

  <vm-list v-if="subview === 'vmlist'" />
  <org-tree v-if="subview === 'orgtree'" />
  <vm-adv-search v-if="subview === 'vmadvsearch'" />
  <vm-create v-if="subview === 'vmcreate'" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps, Subview } from '@/store/index.ts'

import SearchBar from '@/components/Usage/SearchBar.vue'
import VmList from '@/components/Usage/VmList.vue'
import OrgTree from '@/components/Usage/OrgTree.vue'
import VmAdvSearch from '@/components/Usage/VmAdvSearch.vue'
import VmCreate from './VmCreate.vue'

export default defineComponent({
  name: 'VMManager',
  components: {
    SearchBar,
    VmList,
    OrgTree,
    VmAdvSearch,
    VmCreate
  },
  props: {
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const subview = computed(() => store.state.position.subview)
    const gotoSubview = (subview: Subview) => store.commit('gotoSubview', subview)
    return {
      subview,
      gotoSubview
    }
  }

})
</script>

<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.searchbar {
  margin-top: -14px;
}
</style>
