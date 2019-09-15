<template>
  <div class="Users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索 -->
  <div style="margin: 10px 0;">
    <el-input style="width: 300px;" placeholder="请输入搜索内容" v-model="query" class="input-with-select" @keyup.native.enter='search'>
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success" plain style='margin-left: 10px;' @click='showAdd'>添加用户</el-button>
  </div>

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
            <template v-slot='{row}'>
              <el-switch
                v-model="row.mg_state"
                @change='changeState(row)'
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template v-slot="{row}">
           <el-button type="primary" icon="el-icon-edit" size="small" plain circle @click='showEdit(row)'></el-button>
           <el-button type="danger" icon="el-icon-delete" size="small" plain circle @click='delUser(row.id)'></el-button>
           <el-button type="success" icon="el-icon-check" size="small" plain round @click="showAssignDialog(row)">分配角色</el-button>
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

    <!-- 添加用户 -->
  <el-dialog title="添加用户" :visible.sync="dialogVisible" width="35%">
    <el-form :model="addForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="addForm.email" placeholder="请输入email"></el-input>
      </el-form-item>
      <el-form-item label="电话号码" prop="mobile">
        <el-input v-model="addForm.mobile" placeholder="请输入电话"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
  </el-dialog>

  <!-- 修改用户的对话框 -->
  <el-dialog
    title="修改用户信息"
    :visible.sync="editDialogVisible"
    width="35%"
    >
    <el-form :model="editForm" status-icon :rules="rules" ref="editUserForm" label-width="100px">
      <el-form-item label="用户名">
        <el-tag type="info" >{{editForm.username}}</el-tag>
      </el-form-item>
      <el-form-item label="email" prop="email">
        <el-input v-model="editForm.email" placeholder="请输出email"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="editForm.mobile" placeholder="请输入电话号码"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editUser">确 定</el-button>
    </span>
  </el-dialog>

  <!-- 分配角色的对话框 -->
    <el-dialog
    title="分配角色"
    :visible.sync="assignDialogVisible"
    width="35%"
    >
    <el-form :model="assignForm" status-icon :rules="rules" ref="assignForm" label-width="100px">
      <el-form-item label="用户名">
        <el-tag type="info" >{{assignForm.username}}</el-tag>
      </el-form-item>
      <el-form-item label="角色列表">
        <el-select v-model="assignForm.rid">
          <el-option v-for='item in assignList' :key='item.id' :label='item.roleName' :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="assignDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click='assignRole'>分 配</el-button>
    </span>
  </el-dialog>
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
      total: 0,
      // 添加框
      dialogVisible: false,
      // 修改框
      editDialogVisible: false,
      // 分配角色
      assignDialogVisible: false,
      // 添加用户的信息
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改信息列表
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      assignForm: {
        id: '',
        rid: '',
        username: ''
      },
      // 表单验证
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '用户名为3-12位', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: ['blur', 'change'] },
          { min: 6, max: 12, message: '密码为6-12位', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]
      },
      assignList: []
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
    },
    search () {
      // 搜索的时候从第一页开始
      this.pagenum = 1
      this.getAxios()
    },
    showAdd () {
      this.dialogVisible = true
    },
    // 添加用户
    async addUser () {
      try {
        await this.$refs.ruleForm.validate()
        const { meta } = await this.$axios.post('users', this.addForm)
        // console.log(meta)
        if (meta.status === 201) {
          this.$message.success('添加成功')
          // 重置表单
          this.$refs.ruleForm.resetFields()
          // 隐藏模态框
          this.dialogVisible = false
          // 重新渲染页面
          // 新增了一条数据，让总数+1
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getAxios()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        return false
      }
    },
    // 删除用户
    async delUser (id) {
      try {
        // 弹出用户确认框
        await this.$confirm('确定要删除该用户吗?', '温馨提示', { type: 'warning' })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message(meta.msg)
          // 删除用户成功后，需要重新渲染当前页，但是如果当前页就剩下一条数据了，删除用户成功了，应该渲染上一页
          if (this.tableData.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getAxios()
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    },
    // 修改状态
    async changeState (row) {
      console.log(row)
      const { meta } = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 显示修改框.并且展示
    showEdit (row) {
      console.log(row)
      this.editDialogVisible = true
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      // this.editForm = { ...row }
    },
    // 点击确定修改按钮
    async editUser () {
      try {
        await this.$refs.editUserForm.validate()
        const { meta } = await this.$axios.put(`users/${this.editForm.id}`, this.editForm)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          // 重置表单
          this.$refs.editUserForm.resetFields()
          // 关闭修改框
          this.editDialogVisible = false
          // 重新渲染数据
          this.getAxios()
        } else {
          this.$message.error(meta.msg)
        }
      } catch {
        return false
      }
    },
    // 显示角色分配框
    async showAssignDialog (row) {
      // console.log(row)
      this.assignDialogVisible = true
      this.assignForm.username = row.username
      this.assignForm.id = row.id

      // 回显
      const { meta, data } = await this.$axios.get(`users/${row.id}`)
      // console.log(meta, data)
      if (meta.status === 200) {
        // 如果rid是-1的话，不需要回显，让rid是个空
        if (data.rid !== -1) {
          this.assignForm.rid = data.rid
        } else {
          this.assignForm.rid = ''
        }
      }

      // 发送请求,获取所有的角色列表
      const res = await this.$axios.get('roles')
      // console.log(res.meta, res.data)
      if (res.meta.status === 200) {
        this.assignList = res.data
      }
    },
    // 点击分配按钮上传数据
    async assignRole () {
      if (!this.assignForm.rid) {
        return this.$message.error('请选择一个角色')
      }
      const { meta } = await this.$axios.put(`users/${this.assignForm.id}/role`, this.assignForm)
      if (meta.status === 200) {
        // 隐藏对话框
        this.assignDialogVisible = false
        // 重新渲染
        this.$message.success('分配角色成功')
      }
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
