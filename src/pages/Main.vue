<template>
  <div class="Main">
    <div class="title row items-center text-h6 q-pl-xl q-pt-lg">
      您好，testAdmin！
    </div>
    <div class="q-pt-lg q-pb-lg q-pl-xl q-pr-xl doc-container">
      <div class="row items-center q-gutter-lg">
        <q-responsive :ratio="8 / 2.5" class="col">
          <q-card flat bordered class="my-card">
            <q-card-section class="bg-teal text-white">
              <div class="text-h6 text-weight-bold">待办事项</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="row items-center no-wrap q-gutter-md q-pt-sm">
                <div class="col">
                  <div class="text-center text-subtitle1">待支付订单</div>
                  <div class="text-center text-h6">2</div>
                </div>
                <div class="col">
                  <div class="text-center text-subtitle1">待办工单</div>
                  <div class="text-center text-h6">2</div>
                </div>
                <div class="col">
                  <div class="text-center text-subtitle1">资源配额调整</div>
                  <div class="text-center text-h6">2</div>
                </div>
                <div class="col">
                  <div class="text-center text-subtitle1">待确认组</div>
                  <div class="text-center text-h6">2</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-responsive>
        <q-responsive :ratio="8 / 2.5" class="col">
          <q-card flat bordered class="my-card">
            <q-card-section class="bg-teal text-white">
              <div class="text-h6 text-weight-bold">资源到期预警</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="row items-center no-wrap q-gutter-md q-pt-sm">
                <div class="col">
                  <div class="text-center text-subtitle1">本周到期</div>
                  <div class="text-center text-h6">2</div>
                </div>
                <div class="col">
                  <div class="text-center text-subtitle1">一个月到期</div>
                  <div class="text-center text-h6">2</div>
                </div>
                <div class="col">
                  <div class="text-center text-subtitle1">半年到期</div>
                  <div class="text-center text-h6">2</div>
                </div>
                <div class="col">
                  <div class="text-center text-subtitle1">到期未支付</div>
                  <div class="text-center text-h6">2</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-responsive>
        <q-responsive :ratio="8 / 2.5" class="col">
          <q-card flat bordered class="my-card">
            <q-card-section class="bg-teal text-white">
              <div class="text-h6 text-weight-bold">快捷入口</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="row items-center no-wrap">
                <div class="col">
                  <span class="q-pl-xl" style="font-size: 3em; color: Tomato">
                    <i class="fas fa-server"></i>
                  </span>
                  <br />
                  <div class="q-pl-lg">创建云主机</div>
                </div>
                <div class="col">
                  <span class="q-pl-lg" style="font-size: 3em; color: Tomato">
                    <i class="fas fa-cog"></i>
                  </span>
                  <br />
                  <div class="q-pl-lg">VPN配置</div>
                </div>
                <div class="col">
                  <span class="q-pl-lg" style="font-size: 3em; color: Tomato">
                    <i class="fas fa-yen-sign"></i>
                  </span>
                  <br />
                  <div class="q-pl-lg">计费中心</div>
                </div>
                <div class="col">
                  <span class="q-pl-lg" style="font-size: 3em; color: Tomato">
                    <i class="fas fa-wrench"></i> </span
                  ><br />
                  <div class="q-pl-lg">工单中心</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-responsive>
      </div>
      <div class="row items-center q-gutter-lg q-pt-lg">
        <q-responsive :ratio="8 / 4" class="col">
          <q-card flat bordered class="my-card">
            <q-card-section class="bg-teal text-white">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-h6 text-weight-bold">云主机</div>
                </div>
                <div class="col-auto">
                  <q-btn flat label="全部云主机"> </q-btn>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <q-table
                :rows="serverData"
                :columns="columns"
                row-key="ip"
                color="secondary"
              >
              </q-table>
            </q-card-section>
            <q-card-actions>
              <q-btn flat>Action 1</q-btn>
              <q-btn flat>Action 2</q-btn>
            </q-card-actions>
          </q-card>
        </q-responsive>
        <q-responsive :ratio="8 / 4" class="col">
          <q-card flat bordered class="my-card">
            <q-card-section class="bg-teal text-white">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-h6 text-weight-bold">对象存储</div>
                </div>
                <div class="col-auto">
                  <q-btn flat label="全部存储桶"> </q-btn>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section> Lorem ipsum </q-card-section>
            <q-separator />
            <q-card-actions>
              <q-btn flat>Action 1</q-btn>
              <q-btn flat>Action 2</q-btn>
            </q-card-actions>
          </q-card>
        </q-responsive>
      </div>
      <div class="row items-center q-gutter-lg q-pt-lg">
        <q-responsive :ratio="8 / 3.5" class="col">
          <q-card flat bordered class="my-card">
            <q-card-section class="bg-teal text-white">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-h6 text-weight-bold">用户资源配额</div>
                </div>
                <div class="col-auto">
                  <q-btn flat label="全部资源"> </q-btn>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </q-card-section>
            <q-separator />
            <q-card-actions>
              <q-btn flat>Action 1</q-btn>
              <q-btn flat>Action 2</q-btn>
            </q-card-actions>
          </q-card>
        </q-responsive>
        <q-responsive :ratio="8 / 3.5" class="col">
          <q-card flat bordered class="my-card">
            <q-card-section class="bg-teal text-white">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-h6 text-weight-bold">费用概览</div>
                </div>
                <div class="col-auto">
                  <q-btn color="grey-7" round flat icon="more_vert"> </q-btn>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </q-card-section>
            <q-separator />
            <q-card-actions>
              <q-btn flat>Action 1</q-btn>
              <q-btn flat>Action 2</q-btn>
            </q-card-actions>
          </q-card>
        </q-responsive>
        <q-responsive :ratio="8 / 3.5" class="col">
          <q-card flat bordered class="my-card">
            <q-card-section class="bg-teal text-white">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-h6 text-weight-bold">我的组</div>
                </div>
                <div class="col-auto">
                  <q-btn color="grey-7" round flat icon="more_vert"> </q-btn>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </q-card-section>
            <q-separator />
            <q-card-actions>
              <q-btn flat>Action 1</q-btn>
              <q-btn flat>Action 2</q-btn>
            </q-card-actions>
          </q-card>
        </q-responsive>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
const columns = [
  {
    name: 'type',
    label: '类型',
    align: 'center',
    field: 'type'
  },
  {
    name: 'ip',
    align: 'center',
    label: 'IP地址',
    field: 'ip'
  },
  {
    name: 'status',
    align: 'center',
    label: '运行状态',
    field: 'status'
  },
  {
    name: 'center',
    align: 'center',
    label: '数据中心',
    field: 'center'
  },
  {
    name: 'remark',
    align: 'center',
    label: '备注',
    field: 'remark'
  },
  {
    name: 'op',
    align: 'center',
    label: '操作'
  }
]
const serverData = [
  {
    type: '1',
    ip: '11.11.1.1',
    status: 'ok',
    center: 'e_HR_204',
    remark: '用于前端开发'
  },
  {
    type: '1',
    ip: '11.11.1.1',
    status: 'ok',
    center: 'e_HR_204',
    remark: '用于前端开发'
  },
  {
    type: '1',
    ip: '11.11.1.1',
    status: 'ok',
    center: 'e_HR_204',
    remark: '用于前端开发'
  },
  {
    type: '1',
    ip: '11.11.1.1',
    status: 'ok',
    center: 'e_HR_204',
    remark: '用于前端开发'
  },
  {
    type: '1',
    ip: '11.11.1.1',
    status: 'ok',
    center: 'e_HR_204',
    remark: '用于前端开发'
  },
  {
    type: '1',
    ip: '11.11.1.1',
    status: 'ok',
    center: 'e_HR_204',
    remark: '用于前端开发'
  },
  {
    type: '1',
    ip: '11.11.1.1',
    status: 'ok',
    center: 'e_HR_204',
    remark: '用于前端开发'
  }

]
export default defineComponent({
  name: 'Main',
  components: {
  },
  props: {
  },
  setup () {
    return {
      columns,
      serverData
    }
  }
})
</script>

<style lang="scss" scoped>
.Main {
}
.title {
  height: 100%;
  max-height: 200px;
}
.bg-color {
  background-color: $nord6;
}
.my-card {
  width: 100%;
}
</style>
