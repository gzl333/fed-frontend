<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          中国科技云联邦-用户使用手册
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      menu
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      content
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ManualLayout',
  components: {},
  props: {},
  setup () {
    const leftDrawerOpen = ref(false)
    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }
    return {
      leftDrawerOpen,
      toggleLeftDrawer
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
