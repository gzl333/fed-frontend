<template>
  <div class="FederationMonitorVideoMeeting.vue">
    <country-meeting-map></country-meeting-map>
    <b-j-meeting-map></b-j-meeting-map>
<!--    <country-meeting-map1></country-meeting-map1>-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CountryMeetingMap from 'components/Chart/CountryMeetingMap.vue'
import BJMeetingMap from 'components/Chart/BJMeetingMap.vue'
// import CountryMeetingMap1 from 'components/Chart/CountryMeetingMap1.vue'
export default defineComponent({
  name: 'FederationMonitorVideoMeeting.vue',
  components: {
    CountryMeetingMap,
    BJMeetingMap
    // CountryMeetingMap1
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
