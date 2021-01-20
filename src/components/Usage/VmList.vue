<template>
  <el-table :data="tableData" border stripe style="width: 95%" class="table">
    <el-table-column type="index" label="序号" width="50"> </el-table-column>
    <el-table-column prop="ip" label="IP地址" width="150"> </el-table-column>
    <el-table-column prop="center" label="数据中心" width="110">
    </el-table-column>
    <el-table-column prop="type" label="服务类型" width="100">
    </el-table-column>
    <el-table-column prop="os" label="镜像类型" width="180"> </el-table-column>
    <el-table-column prop="config" label="CPU/内存" width="100">
    </el-table-column>
    <el-table-column prop="countdown" label="剩余有效期" width="100">
    </el-table-column>
    <el-table-column prop="source" label="资源来源" width="100">
    </el-table-column>
    <el-table-column prop="note" label="备注" width="200"> </el-table-column>
    <el-table-column prop="status" label="状态" width="100">
      <el-button type="success" icon="" plain>运行</el-button>
    </el-table-column>
    <el-table-column prop="operation" label="操作" width="350">
      <el-button icon="" plain>VNC</el-button>
      <el-button icon="" plain>VPN</el-button>
      <el-button type="primary" icon="el-icon-arrow-down" plain>
        操作列表
      </el-button>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const testData = [{
  ip: '159.226.100.100',
  center: 'OO_HR_204',
  type: 'openstack',
  os: 'Windows Serer 2019',
  config: '4 / 16GB',
  countdown: '730',
  source: 'A组',
  note: '用于云联邦开发'
},
{
  ip: '159.226.100.100',
  center: 'OO_HR_204',
  type: 'openstack',
  os: 'Windows Serer 2019',
  config: '4 / 16GB',
  countdown: '730',
  source: 'A组',
  note: '用于云联邦开发'
},
{
  ip: '159.226.100.100',
  center: 'OO_HR_204',
  type: 'openstack',
  os: 'Windows Serer 2019',
  config: '4 / 16GB',
  countdown: '730',
  source: 'A组',
  note: '用于云联邦开发'
},
{
  ip: '159.226.100.100',
  center: 'OO_HR_204',
  type: 'openstack',
  os: 'Windows Serer 2019',
  config: '4 / 16GB',
  countdown: '730',
  source: 'A组',
  note: '用于云联邦开发'
},
{
  ip: '159.226.100.100',
  center: 'OO_HR_204',
  type: 'openstack',
  os: 'Windows Serer 2019',
  config: '4 / 16GB',
  countdown: '730',
  source: 'A组',
  note: '用于云联邦开发'
},
{

  ip: '159.226.100.100',
  center: 'OO_HR_204',
  type: 'openstack',
  os: 'Windows Serer 2019',
  config: '4 / 16GB',
  countdown: '730',
  source: 'A组',
  note: '用于云联邦开发'
}

]

export default defineComponent({
  name: 'VmList',
  components: {
  },
  props: {
  },
  setup () {
    return {
      tableData: testData
    }
  }
})
</script>

<style>
.table {
  margin: 0 auto;
}
</style>
