<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 渲染表格 -->
    <el-table :data="rolesList" style="width: 100%">
      <el-table-column type="expand">
        <template v-slot='{row}'>
          <!-- 一级权限 -->
          <el-row class="L1" v-for='L1 in row.children' :key='L1.id'>
            <el-col :span="4">
              <el-tag class="L1-tag" closable @close='delRoles(row, L1.id)'>{{L1.authName}}</el-tag>
            </el-col>
            <el-col :span='20'>
            <!-- 二级权限 -->
              <el-row class="L2" v-for='L2 in L1.children' :key='L2.id'>
                <el-col :span="4">
                  <el-tag closable type="success" @close='delRoles(row, L2.id)'>{{L2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <!-- 三级权限 -->
                  <el-tag class="L3" type="warning" closable v-for='L3 in L2.children' :key="L3.id" @close='delRoles(row, L3.id)'>{{L3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column label="操作">
        <template v-slot='{row}'>
          <el-button type="primary" plain circle icon="el-icon-edit" size="small"></el-button>
          <el-button type="danger" plain circle icon="el-icon-delete" size="small"></el-button>
          <el-button type="success" plain round icon="el-icon-check" size="small" @click='showAssignDialog(row)'>分配权限</el-button>
        </template>
     </el-table-column>
    </el-table>

     <!-- 分配权限对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="dialogVisible"
        width="35%"
        >
        <!--
          data指定显示的数据
          props指定树状元素的显示内容和子元素
          show-checkbox 树状元素是否可被选中
          default-expand-all 是否展开所有
         -->
        <el-tree
        :data="rightList"
        :props="props"
        show-checkbox
        default-expand-all
        ref='tree'
        node-key="id"
        ></el-tree>
        <span slot="footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="assignRight">分 配</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      dialogVisible: false,
      // 所有的权限
      rightList: [],
      // 选中的角色
      roleId: '',
      // 树状菜单的配置
      props: {
        label: 'authName',
        children: 'children'
      }
    }
  },
  methods: {
    async getRolesList () {
      const { meta, data } = await this.$axios.get('roles')

      if (meta.status === 200) {
        this.rolesList = data
      }
    },
    async delRoles (row, rightId) {
      const { meta, data } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      console.log(meta, data)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        // this.getRolesList() // 不需要加载整个页面的数据
        // 只需要更新当前角色的权限信息
        // row:当前角色
        row.children = data
      }
    },
    async showAssignDialog (row) {
      this.dialogVisible = true
      // console.log(row)
      const { meta, data } = await this.$axios.get('rights/tree')
      // console.log(meta, data)
      if (meta.status === 200) {
        // 要展示的数据
        this.rightList = data
      }
      // 角色的数据
      this.roleId = row.id
      // 默认选中角色已有的权限
      // 获取角色已有的三级权限
      let rights = []
      row.children.forEach(L1 => {
        L1.children.forEach(L2 => {
          L2.children.forEach(L3 => rights.push(L3.id))
        })
      })
      this.$refs.tree.setCheckedKeys(rights)
    },
    async assignRight () {
      const allChecked = this.$refs.tree.getCheckedKeys()
      const halfChecked = this.$refs.tree.getHalfCheckedKeys()
      console.log(allChecked, halfChecked)
      const rids = [...allChecked, ...halfChecked].join()

      // 发送ajax请求
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      if (meta.status === 200) {
        this.$message.success('分配权限成功')
        this.getRolesList()
        this.dialogVisible = false
      }
    }
  },
  created () {
    this.getRolesList()
  }
}
</script>

<style lang='scss' scoped>
.L1 {
  border-bottom: 1px dotted red;
  .L1-tag {
    margin-top: 5px;
  }
}
.L2 {
  margin: 5px 0;
}
.L3 {
  margin-right: 5px;
}
</style>
