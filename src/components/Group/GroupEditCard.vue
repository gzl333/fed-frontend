<template>

  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin dialog-primary">
      <!--
        ...content
        ... use q-card-section for it?
      -->
      <q-card-section>
        <div class="text-h6 q-pb-lg">{{ $t('编辑项目组信息') }}</div>
      </q-card-section>

      <q-card-section>
        <div class="row items-center q-pb-md">
          <div class="col-2 text-grey">项目组名称</div>
          <div class="col">
            <q-input outlined dense v-model="groupName"/>
          </div>
        </div>

        <div class="row items-center q-pb-md">
          <div class="col-2 text-grey">所属单位</div>
          <div class="col">
            <q-input outlined dense v-model="groupCompany"/>
          </div>
        </div>

        <div class="row items-center q-pb-md">
          <div class="col-2 text-grey">备注</div>
          <div class="col">
            <q-input outlined dense v-model="groupDescription"/>
          </div>
        </div>
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn color="primary" unelevated @click="onCancelClick">
          {{ $t('取消') }}
        </q-btn>
        <q-btn color="primary" outline @click="onOKClick">
          {{ $t('确定') }}
        </q-btn>
      </q-card-actions>

    </q-card>
  </q-dialog>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'GroupEditCard',
  components: {},
  props: {
    groupId: {
      type: String,
      required: true
    }
  },
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits
  ],
  setup (props) {
    // REQUIRED; must be called inside of setup()
    const {
      dialogRef,
      onDialogHide,
      onDialogOK,
      onDialogCancel
    } = useDialogPluginComponent()

    const $store = useStore<StateInterface>()
    // 以下写法是否正确？
    // const groupName = ref(computed(() => $store.state.account.tables.groupTable.byId[props.groupId].name).value)
    const groupName = ref($store.state.account.tables.groupTable.byId[props.groupId].name)
    const groupCompany = ref($store.state.account.tables.groupTable.byId[props.groupId].company)
    const groupDescription = ref($store.state.account.tables.groupTable.byId[props.groupId].description)

    // 点击ok的事件函数
    const onOKClick = () => {
      // payload是传给onOK的实参, data从这里传到action里面
      onDialogOK({
        name: groupName.value,
        company: groupCompany.value,
        description: groupDescription.value
      })
    }

    return {
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,
      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick,
      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
      // 以上为dialog模板必须

      $store,
      groupName,
      groupCompany,
      groupDescription
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupEditCard {
}
</style>
