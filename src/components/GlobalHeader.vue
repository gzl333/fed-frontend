<template>
  <el-row type="flex" class="bg-dark">
    <el-col :span="8">
      <div class="grid-content">
        <img src="@/assets/banner.png" class="logo" />
      </div>
    </el-col>
    <el-col :span="8">
      <div class="grid-content" />
    </el-col>
    <el-col :span="8">
      <div class="grid-content">
        <el-menu
          v-if="!user.isLogin"
          default-active="1"
          mode="horizontal"
          background-color="transparent"
          text-color="#fff"
          active-text-color="#ffd04b"
          @select="handleSelect"
        >
          <el-menu-item index="1"> 首页 </el-menu-item>
          <el-menu-item index="2"> 资源&服务 </el-menu-item>
          <el-menu-item index="3"> 资源提供者 </el-menu-item>

          <el-button>登 录</el-button>
          <el-button type="primary">注 册</el-button>

          <el-button type="text"> English </el-button>
        </el-menu>
        <el-menu
          v-else
          mode="horizontal"
          background-color="transparent"
          text-color="#fff"
          active-text-color="#ffd04b"
          @select="handleSelect"
        >
          <el-menu-item index="1">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                帮助<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item icon="el-icon-document">
                    操作手册
                  </el-dropdown-item>
                  <el-dropdown-item icon="el-icon-s-opportunity">
                    API
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-menu-item>

          <el-menu-item index="2">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                消息通知
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item icon="el-icon-chat-line-round">
                    消息1：嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻
                  </el-dropdown-item>
                  <el-dropdown-item icon="el-icon-chat-line-round">
                    消息2：哈哈哈哈哈哈哈哈哈哈哈哈哈哈
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-menu-item>

          <el-menu-item index="3">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link el-icon-user-solid">
                {{ user.name }}的信息
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item icon="el-icon-chat-line-round">
                    个人设置
                  </el-dropdown-item>
                  <el-dropdown-item icon="el-icon-chat-line-round">
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-menu-item>
        </el-menu>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export interface UserProps {
  isLogin: boolean;
  id?: number;
  role?: 'user'|'manager'|'provider'|'vo';
  name?: string;

}

export default defineComponent({
  name: 'Header',
  components: {
  },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      require: true
    }
  },
  setup () {
    return {
    }
  },
  data () {
    return {
    }
  },
  methods: {
  }
})
</script>

<style>
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-dark {
  background: #040c20;
}
.grid-content {
  padding-top: 10.5px;
  height: 50.5px;
  margin-left: 30px;
  float: left;
  border-radius: 4px;
  min-height: 36px;
  font-family: "Microsoft YaHei";
  color: #ffffff;
}
.logo {
  height: 40px;
}
.el-menu {
  top: -10px;
}
.el-dropdown-link {
  color: #ffffff;
}
</style>
