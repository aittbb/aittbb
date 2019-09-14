//     1.element ui页面样式.
//     2.input校验不能为空,
//     3.点击校验
//     4.重置.
//     5.发送请求

<template>
  <div class="login">
    <el-form :model="form" label-width="80px" :rules="rules" status-icon ref="resetForm">
      <img src="../assets/avatar.jpg"/>
      <el-form-item label="用户名:" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" type="password" @keyup.enter.native="login"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click='resetForm'>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

// import axios from 'axios'

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      // 表单校验
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 12,
            message: '请输入3-12位用户名',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change']
          },
          {
            min: 6,
            max: 12,
            message: '请输入6-12位密码',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    // 用ref和$refs获取form组件,进行表单重置
    resetForm () {
      this.$refs.resetForm.resetFields()
    },
    // 正常的代码.
    // login () {
    //   // valid 表单是否校验成功
    //   this.$refs.resetForm.validate(valid => {
    //     if (!valid) return false
    //     this.$axios.post('login', this.form).then(res => {
    //       // console.log(res.data)
    //       const { meta, data } = res
    //       if (meta.status === 200) {
    //         // 存储token
    //         localStorage.setItem('token', data.token)
    //         this.$router.push('/home')
    //         // 成功的提示
    //         this.$message({
    //           type: 'success',
    //           message: meta.msg,
    //           duration: 1000
    //         })
    //       } else {
    //         this.$message({
    //           type: 'error',
    //           message: meta.msg,
    //           duration: 1000
    //         })
    //       }
    //     })
    //   })
    // }
    // 用promise,async与await,try与catch改写login
    async login () {
      // try catch 处理成功和失败结果.不会影响下面代码的执行,就是不会报错
      try { // 成功
        // 等待表单校验成功
        await this.$refs.resetForm.validate()
        // 校验成功后发送axios
        const { meta, data } = await this.$axios.post('login', this.form)
        console.log(meta)
        if (meta.status === 200) {
          // 存储token
          localStorage.setItem('token', data.token)
          this.$router.push('/home') // 跳转到home
          // 并且提示成功信息
          this.$message({
            type: 'success',
            message: meta.msg,
            duration: 1000 // 提示显示的时间
          })
        } else {
          this.$message({
            type: 'error',
            message: meta.msg,
            duration: 1000
          })
        }
      } catch (e) { // 失败结果
        return false
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.login {
  background-color: #2d434c;
  height: 100%;
  overflow: hidden;
  .el-form {
    width: 400px;
    margin: 200px auto;
    background: #fff;
    padding: 70px 45px 15px;
    border-radius: 20px;
    position: relative;
    img {
      position: absolute;
      top: -70px;
      left: 50%;
      transform: translateX(-50%);
      border: 10px solid #fff;
      border-radius: 50%;
    }
    .el-button:last-child {
      margin-left: 80px;
    }
  }
}
</style>
