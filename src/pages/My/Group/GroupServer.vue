<template>
  <div class="GroupServer">

    <div class="row items-center justify-between q-py-md">

      <div class="col-3">
        <div class="row justify-start">
          <div class="col">
            <q-input disable dense outlined v-model="text" stack-label :label="$t('搜索')">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <div class="col-3">
        <div class="row justify-end">
          <div class="col">
            <q-select outlined dense stack-label :label="$t('筛选组')"
                      v-model="groupSelection" :options="groupOptions"/>
          </div>
        </div>
      </div>
    </div>

    <server-table :servers="rows" is-group/>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
// import { useI18n } from 'vue-i18n'
import ServerTable from 'components/ServerTable/ServerTable.vue'

export default defineComponent({
  name: 'GroupServer',
  components: { ServerTable },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    // const { locale } = useI18n({ useScope: 'global' })

    const rows = [{
      id: '9219dfbe-7fdf-11eb-a828-c8009fe2eb02',
      name: 'b2d71fd409694ab7b51bcca34a2721c5',
      vcpus: 1,
      ram: 1024,
      ipv4: '10.107.50.10',
      public_ip: false,
      image: 'CentOS_8.3',
      creation_time: '2021-03-08T07:26:17.056294Z',
      expiration_time: null,
      remarks: 'asdfasdfasdfzlguo@cnic.cn',
      classification: 'personal',
      image_id: '',
      image_desc: '',
      default_user: 'root',
      default_password: 'cnic.cn',
      endpoint_url: 'https://vms.cstcloud.cn',
      service: '2',
      user_quota: '6',
      center_quota: 2,
      vo_id: '12345',
      status: 10,
      user: {
        id: '6',
        username: 'zlguo@cnic.cn'
      }
    },
    {
      id: 'c20b87a2-eddc-11eb-95b1-c8009fe2eb03',
      name: '9b4b717d6fcb4d27b079e071bedf0225',
      vcpus: 1,
      ram: 1024,
      ipv4: '10.0.90.237',
      public_ip: false,
      image: 'Fedora34',
      creation_time: '2021-07-26T06:43:16.908089Z',
      expiration_time: '2021-09-30T06:43:16.905057Z',
      remarks: '研发用云主机',
      classification: 'personal',
      image_id: '10',
      image_desc: '',
      default_user: 'root',
      default_password: 'cnic.cn',
      endpoint_url: 'https://vms.cstcloud.cn/',
      service: '82a060ea-b93b-11eb-90bc-c8009fe2eb03',
      user_quota: '71234804-ea97-11eb-9aaa-c8009fe2eb03',
      center_quota: 1,
      vo_id: '85405689',
      status: 5,
      user: {
        id: '6',
        username: 'zlguo@cnic.cn'
      }
    }
    ]

    return {
      $store,
      rows
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupServer {
}
</style>
