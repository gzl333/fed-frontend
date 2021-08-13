<template>
  <div class="ObsTable">
    <q-table
      flat
      card-class=""
      table-class=""
      table-header-class="bg-grey-1 text-grey"
      :rows="props.buckets"
      :columns="columns"
      row-key="name"
      no-data-label="暂无可用对象存储桶，请创建后使用"
      hide-pagination
      :pagination="paginationTable"
    >

      <template v-slot:body="props">
        <q-tr :props="props"
              @mouseenter="onMouseEnterRow(props.row.name)"
              @mouseleave="onMouseLeaveRow"
        >

          <q-td key="bucketName" :props="props">
            {{ props.row.bucketName }}
          </q-td>

          <q-td key="domainName" :props="props">
            {{ props.row.domainName }}
          </q-td>

          <q-td key="count" :props="props">
            {{ props.row.count }}
          </q-td>

          <q-td key="volume" :props="props">
            {{ props.row.volume }}
          </q-td>

          <q-td key="status" :props="props">
            {{ props.row.status }}
          </q-td>

          <q-td key="writeRead" :props="props">
            {{ props.row.writeRead }}
          </q-td>

          <q-td key="readonly" :props="props">
            {{ props.row.readonly }}
          </q-td>

          <q-td key="creation" :props="props">
            {{ props.row.creation }}
          </q-td>

          <q-td key="operation" :props="props">
            {{ props.row.operation }}
          </q-td>

        </q-tr>
      </template>

<!--      <template v-slot:bottom>-->
<!--      </template>-->

    </q-table>
    <q-separator/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { ServerInterface } from 'src/store/vm/state'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'

import useCopyToClipboard from 'src/hooks/useCopyToClipboard'

export default defineComponent({
  name: 'ObsTable',
  components: {},
  props: {
    buckets: {
      type: Array as PropType<ServerInterface[]>, // todo 待添加obs类型
      required: true
    }
  },
  setup (props) {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // 对象存储列表分栏定义
    const columnsZH = [
      {
        name: 'bucketName',
        label: '存储桶名称',
        field: 'bucketName',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'domainName',
        label: '域名',
        field: 'domainName',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'count',
        label: '对象数量',
        field: 'count',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'volume',
        label: '对象体积',
        field: 'volume',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'status',
        label: 'FTP状态',
        field: 'status',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'writeRead',
        label: 'FTP读写密码',
        field: 'writeRead',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'readonly',
        label: 'FTP只读密码',
        field: 'readonly',
        align: 'center',
        classes: 'ellipsis',
        style: 'padding: 15px 5px'
      },
      {
        name: 'creation',
        label: '创建时间',
        field: 'creation',
        align: 'center',
        classes: 'ellipsis',
        style: 'padding: 15px 5px'
      },
      {
        name: 'operation',
        label: '操作',
        field: 'operation',
        align: 'center',
        style: 'padding: 15px 5px'
      }
    ]
    const columnsEN = [
      {
        name: 'bucketName',
        label: 'Bucket Name',
        field: 'name',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'domainName',
        label: 'Domain Name',
        field: 'domainName',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'count',
        label: 'Object Count',
        field: 'count',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'volume',
        label: 'Total Volume',
        field: 'volume',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'status',
        label: 'FTP Status',
        field: 'status',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'writeRead',
        label: 'FTP Writable Password',
        field: 'writeRead',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'readonly',
        label: 'FTP Readonly Password',
        field: 'readonly',
        align: 'center',
        classes: 'ellipsis',
        style: 'padding: 15px 5px'
      },
      {
        name: 'creation',
        label: 'Creation Time',
        field: 'creation',
        align: 'center',
        classes: 'ellipsis',
        style: 'padding: 15px 5px'
      },
      {
        name: 'operation',
        label: 'Operation',
        field: 'operation',
        align: 'center',
        style: 'padding: 15px 5px'
      }
    ]

    // i18n影响该配置对象取值
    const columns = computed(() => locale.value === 'zh' ? columnsZH : columnsEN)

    // q-pagination 所需配置对象
    const paginationTable = ref({
      // sortBy: 'desc',
      // descending: false,
      page: 1,
      rowsPerPage: 200 // 此为能显示的最大行数，取一个较大值，实际显示行数靠自动计算
    })

    // 复制信息到剪切板
    const clickToCopy = useCopyToClipboard()

    // table row hover
    const hoverRow = ref('')
    const onMouseEnterRow = (rowName: string) => {
      hoverRow.value = rowName
    }
    const onMouseLeaveRow = () => {
      hoverRow.value = ''
    }

    return {
      props,
      $store,
      locale,
      columns,
      paginationTable,
      clickToCopy,
      hoverRow,
      onMouseEnterRow,
      onMouseLeaveRow
    }
  }
})
</script>

<style lang="scss" scoped>
.ObsTable {
}
</style>
