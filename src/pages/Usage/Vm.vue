<template>

  <div class="Vm">
    <div class="row">
      <div class="col-2 items-center bg-nord6 q-pa-sm routerview-height" v-if="isTreeOpen">
        <div class="items-center">机构与数据中心</div>
        <q-tree
          :nodes="simple"
          node-key="label"
          default-expand-all
          control-color="nord11"
        />
      </div>
      <div class="col routerview-height bg-nord7">
        <q-btn label="toggleTree" @click="toggleTree"/>
      </div>
    </div>

  </div>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from '../../store'

export default defineComponent({
  name: 'Vm',
  components: {
  },
  props: {
  },
  setup () {
    const $store = useStore<StateInterface>()
    const currentUser = $store.state.user
    const isTreeOpen = ref(true)
    const toggleTree = () => { isTreeOpen.value = !isTreeOpen.value }
    return {
      currentUser,
      isTreeOpen,
      toggleTree,
      simple: [
        {
          label: '中国科学院计算机网络信息中心',
          children: [
            {
              label: '怀柔机房',
              icon: 'restaurant_menu'
            },
            {
              label: 'Good service (disabled node with icon)',
              icon: 'room_service',
              disabled: true,
              children: [
                { label: 'Prompt attention' },
                { label: 'Professional waiter' }
              ]
            },
            {
              label: 'Pleasant surroundings (with icon)',
              icon: 'photo',
              children: [
                {
                  label: 'Happy atmosphere (with image)',
                  img: 'https://cdn.quasar.dev/img/logo_calendar_128px.png'
                },
                { label: 'Good table presentation' },
                { label: 'Pleasing decor' }
              ]
            }
          ]
        }
      ]
    }
  }
})
</script>

<style lang="scss" scoped>
.Vm {
}
.routerview-height {
  height: calc(100vh - 114px);
}
.routerview-width {
  width: calc(100vw - 165px);
}
</style>
