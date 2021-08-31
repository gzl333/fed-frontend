 <template>
  <div class="GroupMemberAdd">
    <div class="text-weight-bold text-h6 text-primary">
      <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense @click="goBack"/>添加组员</div>
    <div class="q-pa-md" style="max-width: 400px">
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
      >
        <div class="row">
          <div class="col-4 q-mt-md">
            <span>项目组名称</span>
          </div>
          <div class="col-8">
            <q-select clearable bottom-slots outlined v-model="groupId" :options="groupOptions" label="选择项目组" :rules="[ val => val || '请选择项目组']"/>
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-mt-md">
            <span>权限</span>
          </div>
          <div class="col-8">
            <q-select clearable outlined v-model="role" :options="[{label: '管理员', value: 'leader'}, {label: '组员', value: 'member'}]" label="选择权限" :rules="[ val => val || '请选择权限']"/>
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-mt-md">
            <span>科技云通行证账户</span>
          </div>
          <div class="col-8">
            <q-input outlined v-model="username" :rules="[ val => val && val.length > 0 || '科技云通行证账户不能为空']"/>
          </div>
        </div>
        <div>
          <q-btn label="保存修改" type="submit" color="primary" :disable="disable"/>
          <q-btn label="放弃修改" type="reset" color="primary" class="q-ml-md" />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { StateInterface } from 'src/store'
export default defineComponent({
  name: 'GroupMemberAdd',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const router = useRouter()
    const id = router.currentRoute.value.params.id as string
    const groupId = ref()
    const role = ref()
    const username = ref()
    const disable = ref(false)
    const groupOptions = computed(() => $store.getters['group/groupOptions'])
    const label = computed(() => $store.getters['group/groupLabel'](id))
    const initial = () => {
      if (id !== '') {
        groupId.value = {
          value: id,
          label: label
        }
      } else {
        return groupId
      }
    }
    const onSubmit = async () => {
      disable.value = true
      await $store.dispatch('group/insertGroupMember', { groupId: groupId.value, role: role.value, username: username.value })
      disable.value = false
    }
    const onReset = () => {
      if (id !== '') {
        role.value = null
        username.value = null
      } else {
        groupId.value = null
        role.value = null
        username.value = null
      }
    }
    const goBack = () => {
      router.go(-1)
    }
    initial()
    return {
      onSubmit,
      onReset,
      goBack,
      groupId,
      role,
      username,
      groupOptions,
      id,
      initial,
      label,
      disable
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupMemberAdd {
}
</style>
