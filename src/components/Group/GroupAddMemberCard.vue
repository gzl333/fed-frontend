<template>

  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent >
    <q-card class="q-dialog-plugin dialog-primary">
      <!--
        ...content
        ... use q-card-section for it?
      -->
      <q-card-section>
        <div class="text-h6 q-pb-lg">{{ $t('增加人员') }}</div>
      </q-card-section>

      <q-card-section>
        <div class="row items-center q-pb-md">
          <div class="col-3 text-grey">项目组名称</div>
          <div class="col">
            {{ $store.state.group.tables.groupTable.byId[groupId]?.name }}
          </div>
        </div>

        <div v-for="index in userCount" :key="index" class="row items-center q-pb-md">
          <div class="col-3 text-grey">科技云通行证账户{{ index }}</div>
          <div class="col">
            <q-input outlined dense v-model="usernames[index.toString()]" autofocus/>
          </div>
        </div>

        <div class="row justify-center items-center">
          <div class="col-auto">
            <q-btn class="text-center" flat padding="none" icon="add" color="primary"
                   @click="()=>{userCount += 1}">
              更多账户
            </q-btn>
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
import { defineComponent, ref, reactive } from 'vue'
import { useDialogPluginComponent, Notify } from 'quasar'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'GroupAddMemberCard',
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

    const usernames = reactive<Record<string, string>>({})
    const userCount = ref(1)
    const addCount = () => {
      userCount.value += 1
      usernames[userCount.value.toString()] = ''
    }

    // 点击ok的事件函数
    const onOKClick = () => {
      // 检查数据，空数组不发送请求
      // todo 正则检查email格式
      if (Object.values(usernames).length === 0) {
        Notify.create({
          classes: 'notification-negative shadow-15',
          icon: 'mdi-alert',
          textColor: 'negative',
          message: '请输入正确的科技云通行证账户',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      } else {
        // payload是传给onOK的实参, data从这里传到action里面
        onDialogOK({
          groupId: props.groupId,
          usernames: Object.values(usernames)
        })
      }
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
      userCount,
      addCount,
      usernames
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupAddMemberCard {
}
</style>
