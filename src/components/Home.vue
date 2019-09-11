<template>
  <div class="home">
    <el-container>
      <el-header>
        <ul class="ul">
          <li class="logo"></li>
          <li class="title">
            <h1>电商后台管理系统</h1>
          </li>
          <li class="out">
            欢迎您,某某某
            <a href="javascript:;" @click="logOut">退出</a>
          </li>
        </ul>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- default-active 显示高亮 -->
          <el-menu
            :default-active="active"
            unique-opened
            router
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu :index="menu.path" v-for='menu in menuList' :key='menu.id'>
              <template v-slot:title>
                <i class="el-icon-location"></i>
                <span>{{menu.authName}}</span>
              </template>
                <el-menu-item :index="item.path" v-for='item in menu.children' :key='item.id'>
                  <i class="el-icon-menu"></i>
                  <span slot="title">{{item.authName}}</span>
                </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <!-- 子路由的出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      menuList: []
    }
  },
  methods: {
    logOut () {
      // 给用户一个提示
      // 参数1：提示内容
      this.$confirm('你确定要退出吗?', '温馨提示', {
        type: 'warning'
      })
        .then(() => {
          // 点击确定了
          localStorage.removeItem('token')
          // 跳转到登录页
          this.$router.push('/login')
          // 提示
          this.$message.success('退出成功')
        })
        .catch(() => {
          this.$message('操作取消')
        })
    }
  },
  computed: {
    active () {
      return this.$route.path.slice(1)
    }
  },
  created () {
    axios.get('http://localhost:8888/api/private/v1/menus', { headers: { Authorization: localStorage.getItem('token') } }).then(res => {
      console.log(res.data)
      const { meta, data } = res.data
      if (meta.status === 200) {
        this.menuList = data
      }
    })
  }
}
</script>

<style lang='scss' scoped>
.home {
  height: 100%;
  .el-header {
    height: 60px;
    background-color: #b3c1cd;
    .ul {
      display: flex;
      .logo,
      .out {
        width: 180px;
      }
      .title {
        flex: 1;
        h1 {
          text-align: center;
          line-height: 60px;
          color: #fff;
          font-size: 30px;
        }
      }
      .logo {
        background: url("../assets/logo.png") no-repeat center center/contain;
      }
      .out {
        line-height: 60px;
        font-weight: 700px;
        text-align: right;
        a {
          color: orange;
        }
      }
    }
  }
  .el-container {
    height: 100%;
    .el-aside {
      background-color: #545c64;
      .el-submenu {
        width: 200px;
      }
    }
    .el-main {
      height: 100%;
      background-color: #eaeef1;
      box-sizing: border-box;
      padding: 20px;
    }
  }
}
</style>
