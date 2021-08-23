<template>
  <q-drawer
    v-model="leftDrawerOpen"
    show-if-above
    :width="120"
    :breakpoint="0"
    class="bg-c-blue1 text-white"
  >
    <div class="column full-height">
      <q-scroll-area class="col overflow-hidden non-selectable visible">

        <q-list>

          <q-item>
            <q-item-section class="column items-center q-py-sm">
              <img src="fedlogo.png" class="logo"/>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            :active="activeItem === 'main'"
            @click="activeItem = 'main'"
            active-class="active-item"
            to='/my/main'
          >
            <q-item-section class="column items-center">
              <q-icon name="home" size="lg"/>
              <div class="text-c-blue5 text-bold text-center line-height-1em">{{ $t('我的首页') }}</div>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            :active="activeItem === 'personal'"
            @click="activeItem = 'personal'"
            active-class="active-item"
            to='/my/personal'
          >

            <q-item-section class="column items-center">
              <q-icon name="person" size="lg"/>
              <div class="text-c-blue5 text-bold text-center line-height-1em">{{ $t('个人资源') }}</div>
            </q-item-section>
          </q-item>

          <q-item
            :disable="process?.env.PROD"
            clickable
            :active="activeItem === 'group'"
            @click="activeItem = 'group'"
            active-class="active-item"
            to='/my/group'
          >

            <q-item-section class="column items-center">
              <q-icon name="group" size="lg"/>
              <div class="text-c-blue5 text-bold text-center line-height-1em">{{ $t('项目组资源') }}</div>
              <div>dev</div>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            :active="activeItem === 'provider'"
            @click="activeItem = 'provider'"
            active-class="active-item"
            to='/my/provider'
          >
            <q-item-section class="column items-center">
              <q-icon name="cloud_upload" size="lg"/>
              <div class="text-c-blue5 text-bold text-center line-height-1em">{{ $t('资源提供') }}</div>
              <div>dev</div>
            </q-item-section>
          </q-item>

          <q-item
            :disable="process?.env.PROD"
            clickable
            :active="activeItem === 'federation'"
            @click="activeItem = 'federation'"
            active-class="active-item"
            to='/my/federation'
          >
            <q-item-section class="column items-center">
              <q-icon name="construction" size="lg"/>
              <div class="text-c-blue5 text-bold text-center line-height-1em">{{ $t('联邦管理') }}</div>
              <div>dev</div>
            </q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>
    </div>
  </q-drawer>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'GlobalLeftdrawer',
  components: {},
  props: {},
  setup () {
    const leftDrawerOpen = ref(false)
    const activeItem = ref('main')
    return {
      leftDrawerOpen,
      activeItem
    }
  }
})
</script>

<style lang="scss" scoped>
.active-item {
  //color: white !important; // 不起作用
  background-color: $c-blue-6;
}

.logo {
  height: 50px;
}
</style>
