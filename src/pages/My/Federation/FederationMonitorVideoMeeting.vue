<template>
  <div class="FederationMonitorVideoMeeting.vue">
    <country-meeting-map></country-meeting-map>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CountryMeetingMap from 'components/Chart/CountryMeetingMap.vue'
export default defineComponent({
  name: 'FederationMonitorVideoMeeting.vue',
  components: {
    CountryMeetingMap
  },
  props: {},
  emits: {},
  setup () {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.FederationMonitorVideoMeeting.vue {
}
</style>
