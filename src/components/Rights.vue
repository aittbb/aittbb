<template>
  <div class="rights">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>权限列表</a></el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格展示 -->
     <el-table :data="rightList" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="地址"></el-table-column>
      <el-table-column label="层级">
        <template v-slot='{row}'>
          <span v-if='row.level === "0"'>一级</span>
          <span v-else-if='row.level === "1"'>二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  methods: {
    async getRightList () {
      const { meta, data } = await this.$axios.get('rights/list')
      // console.log(meta, data)
      if (meta.status === 200) {
        this.rightList = data
      }
    }
  },
  created () {
    this.getRightList()
  }
}
</script>

<style>

</style>
