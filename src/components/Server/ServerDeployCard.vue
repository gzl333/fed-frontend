<template>
  <div class="ServerDeployCard">

    <div v-if="!dataCenters">
      <q-inner-loading>
        <q-spinner size="50px" color="primary"/>
      </q-inner-loading>
    </div>

    <div v-else>

      <div v-if="isGroup" class="section">
        <div class="text-h7 text-primary section-title">
          {{ $t('项目组') }}
        </div>
        <div class="row items-center q-gutter-md q-pb-lg">
          <div class="col-auto">
            {{ $t('云主机所属项目组') }}
          </div>
          <q-select class="col-4" outlined v-model="radioGroup" dense
                    :options="groups" map-options emit-value option-label="name" option-value="id"/>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'ServerDeployCard',
  components: {},
  props: {
    isGroup: {
      type: Boolean,
      required: true
    },
    groupId: {
      type: String,
      required: false
    },
    serviceId: {
      type: String,
      required: false
    },
    quotaId: {
      type: String,
      required: false
    }
  },
  setup (props) {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // radio选项数据
    const dataCenters = computed(() => Object.values($store.state.vm.tables.globalDataCenterTable.byId))
    // owner/leader权限才能申请配额
    const groups = computed(() => $store.getters['group/getGroupsByMyRole'](['owner', 'leader']))

    return {
      $store,
      locale,
      groups,
      dataCenters
    }
  }
})
</script>

<style lang="scss" scoped>
.ServerDeployCard {
}

.title-area {
  width: $general-width-no-padding;
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
}

.stepper {
  width: $general-width-no-padding;
}

.section {
  margin-bottom: 30px;
  padding: 10px 20px;
  border: 1px solid $grey-4;
  border-radius: 5px;
}

.section-title {
  padding-bottom: 15px;
}

.item-row {
  padding: 5px 0;
}

.item-title {
  text-align: left;
  padding-right: 50px;
  min-width: 250px;
}

.item-title-narrow {
  text-align: left;
  padding-right: 50px;
  min-width: 130px;
}

.radio {
  margin-bottom: 20px;
  padding: 0 10px;
}
</style>
