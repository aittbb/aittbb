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
          <el-col :span="12">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b">
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>导航一</span>
                </template>
                <el-menu-item-group>
                  <template slot="title">分组一</template>
                  <el-menu-item index="1-1">选项1</el-menu-item>
                  <el-menu-item index="1-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                  <el-menu-item index="1-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="1-4">
                  <template slot="title">选项4</template>
                  <el-menu-item index="1-4-1">选项1</el-menu-item>
                </el-submenu>
              </el-submenu>
              <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">导航二</span>
              </el-menu-item>
              <el-menu-item index="3" disabled>
                <i class="el-icon-document"></i>
                <span slot="title">导航三</span>
              </el-menu-item>
              <el-menu-item index="4">
                <i class="el-icon-setting"></i>
                <span slot="title">导航四</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
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
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
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
