<template>
  <div class="login">
    我是login组件
    <el-button type="success" plain circle @click= 'toHome' >成功的按钮</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    toHome () {
      this.$router.push('/home')
    }
  }
}
</script>

<style>

</style>
