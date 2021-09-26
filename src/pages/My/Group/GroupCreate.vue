<template>
  <div class="GroupCreate">

    <div class="column items-center justify-center q-py-md">
      <div class="col q-pa-none">

        <div class="row title-area">
          <div class="col">
            <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
                   @click="goBack"/>
            新建项目组
          </div>
        </div>

        <div class="column content-area q-pt-lg">

          <div class="col">

            <div class="row items-center q-pb-md">
              <div class="col-1 text-grey">
                项目组名称
              </div>
              <div class="col-3">
                <q-input outlined dense v-model="groupName"  >
                  <template v-if="groupName !== ''" v-slot:append>
                    <q-icon name="close" @click="groupName = ''" class="cursor-pointer" />
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row items-center q-pb-md">
              <div class="col-1 text-grey">
                项目组描述
              </div>
              <div class="col-3">
                <q-input outlined dense v-model="groupDesc"  >
                  <template v-if="groupDesc !== ''" v-slot:append>
                    <q-icon name="close" @click="groupDesc = ''" class="cursor-pointer" />
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row items-center q-pb-md">
              <div class="col-1 text-grey">
                所属单位
              </div>
              <div class="col-3">
                <q-input outlined dense v-model="groupCompany"  >
                  <template v-if="groupCompany !== ''" v-slot:append>
                    <q-icon name="close" @click="groupCompany = ''" class="cursor-pointer" />
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row items-center q-pt-lg ">
              <div class="col-1">
                <q-btn  outline color="primary" @click="$store.dispatch('group/createGroup', {name: groupName, company: groupCompany, description: groupDesc})"  >
                  {{$t('创建')}}
                </q-btn>
              </div>
              <div class="col-3">
                <q-btn  unelevated color="primary" @click="goBack">
                  {{$t('放弃')}}
                </q-btn>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'GroupCreate',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $router = useRouter()
    const { locale } = useI18n({ useScope: 'global' })

    // 返回上一页
    const goBack = () => {
      $router.go(-1)
    }

    const groupName = ref('')
    const groupDesc = ref('')
    const groupCompany = ref(computed(() => $store.state.account.decoded?.orgName).value)

    return {
      $store,
      locale,
      goBack,
      groupName,
      groupCompany,
      groupDesc
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupCreate {
}

.title-area {
  width: $general-width-no-padding;
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
}

.content-area {
  width: $general-width-no-padding;
}

.detail-area {
  margin-top: 10px;
  padding: 15px 0;
  height: 120px;
  border: $grey-4 1px solid;
  border-radius: 5px;
}
</style>
