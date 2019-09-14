<template>
  <div class="Users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索 -->

    <!-- 表格 -->
    <template>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="username"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          label="用户状态">
            <template v-slot='scope'>
              <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template v-slot="scope">
           <el-button type="primary" icon="el-icon-edit" size="small" plain circle></el-button>
           <el-button type="danger" icon="el-icon-delete" size="small" plain circle></el-button>
           <el-button type="success" icon="el-icon-check" size="small" plain round>分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 分页 -->
    <div class="block">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[2, 4, 6, 8]"
        :page-size = pagesize
        :current-page = pagenum
        :total="total"
        @size-change = "getPagesize"
        @current-change = 'getPagenum'>
      </el-pagination>
    </div>
  </div>
</template>

<script>
// import Axios from 'axios'
export default {
  data () {
    return {
      tableData: [],
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: 0
    }
  },
  methods: {
    async getAxios () {
      const { meta, data } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.tableData = data.users
        this.total = data.total
      }
    },
    getPagenum (val) {
      this.pagenum = val
      this.getAxios()
    },
    getPagesize (val) {
      this.pagesize = val
      this.getAxios()
    }
  },
  created () {
    this.getAxios()
  }
}
</script>

<style lang='scss' scoped>
  .el-breadcrumb {
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    margin-bottom: 20px;
    background: #ddd;
  }
</style>
