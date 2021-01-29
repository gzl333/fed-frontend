<template>
  <el-scrollbar>
    <div class="Home">
      <el-carousel interval="2000" height="600px">
        <div></div>
        <el-carousel-item v-for="item in pictures" :key="item">
          <div
            class="carousel-content"
            :style="{ backgroundImage: `url(${item})` }"
          >
            <!-- <img
              style="height: 250px; margin-top: 100px; margin-bottom: -100px"
              src="@/assets/logo.png"
              alt=""
            /> -->
            <div class="carousel-text">{{ currentPosition }}</div>
          </div>
        </el-carousel-item>
      </el-carousel>
      <div>资源与服务</div>
      <div>
        <span>云服务器</span><span>云硬盘</span><span>对象存储桶</span
      ><span>开放虚拟镜像池</span><span>科技云盘</span>
      </div>
      <div>资源提供者</div>
      <div>开发者</div>
      <div class="footer">©CNIC 2021</div>
    </div>
  </el-scrollbar>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'

export default defineComponent({
  name: 'Home',
  components: {},
  props: {},
  setup () {
    const store = useStore<GlobalDataProps>()
    const currentPosition = computed(() => store.state.position.slice(-1)[0])
    const pictures = [
      require('@/assets/Home/1.jpg'),
      require('@/assets/Home/2.jpg'),
      require('@/assets/Home/4.jpg')
    ]
    return {
      currentPosition,
      pictures
    }
  }
})
</script>

<style scoped>
.Home {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
  min-height: 100%;
  overflow: hidden;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.carousel-content {
  width: 100%;
  height: 100%;
  line-height: 200px;
  color: #fff;
  font-size: 80px;
}

.carousel-text {
  margin-bottom: -100px;
}

.footer {
  background-color: #040c20;
  line-height: 60px;
  color: #fff;
}
</style>
