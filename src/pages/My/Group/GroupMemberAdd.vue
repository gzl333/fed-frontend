 <template>
  <div class="GroupMemberAdd">
    <div class="text-weight-bold text-h6">
      <q-btn icon="arrow_back_ios" color="black" flat unelevated dense
             @click="goBack"/>添加组员</div>
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
            <q-select outlined v-model="model" :options="options" label="选择项目组" />
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-mt-md">
            <span>权限</span>
          </div>
          <div class="col-8">
            <q-select outlined v-model="model" :options="options" label="选择权限" />
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-mt-md">
            <span>科技云通行证账户</span>
          </div>
          <div class="col-8">
            <q-input outlined v-model="text" />
          </div>
        </div>
        <div>
          <q-btn label="保存修改" type="submit" color="primary"/>
          <q-btn label="放弃修改" type="reset" color="primary" class="q-ml-md" />
        </div>
      </q-form>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'GroupMemberAdd',
  components: {},
  props: {},
  setup () {
    const router = useRouter()
    const onSubmit = () => {
      return {}
    }
    const onReset = () => {
      return {}
    }
    const goBack = () => {
      router.go(-1)
    }
    return {
      onSubmit,
      onReset,
      model: ref(null),
      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ],
      text: ref(''),
      goBack
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupMemberAdd {
}
</style>
