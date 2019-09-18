<template>
  <div class="Categories">
    <!-- 添加分类按钮 -->
    <el-button type="success" plain @click='showAdd'>添加分类</el-button>
    <!-- 展示表格 -->
    <el-table
    :data="categoriesList"
    row-key="cat_id"
    v-loading="loading"
    element-loading-text="拼命加载中..."
    >
      <el-table-column label="分类名称" prop="cat_name"></el-table-column>
      <el-table-column label="是否有效">
        <template v-slot="{row}">
          {{row.cat_deleted ? '否' : '是'}}
        </template>
      </el-table-column>
      <el-table-column label="级别" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" plain circle icon="el-icon-edit" size="small"></el-button>
          <el-button type="danger" plain circle icon="el-icon-delete" size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="dialogVisible"
      width="35%">
      <el-form :rules="rules" :model="form" label-width="80px" ref='form' status-icon>
        <el-form-item label="分类名称" prop='cat_name'>
          <el-input placeholder="请输入分类名称" v-model="form.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <!--
            级联菜单
              options: 控制数据
              props: 控制显示的内容
              clearable: 会显示情况按钮
          -->
          <el-cascader
            v-model="form.cat_pid"
            :options="parentList"
            :props="props"
            clearable
            >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      categoriesList: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      dialogVisible: false,
      loading: false,
      form: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      },
      // 父级分类数据
      parentList: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true
      },
      rules: {
        cat_name: [
          { repuired: true, message: '请输入分类的名称', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    async getCategoriesList () {
      this.loading = true
      const { meta, data } = await this.$axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // console.log(meta, data)
      if (meta.status === 200) {
        this.categoriesList = data.result
        this.total = data.total
      }
      this.loading = false
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.getCategoriesList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCategoriesList()
    },
    async showAdd () {
      this.dialogVisible = true

      // 加载父级的分类数据(加载2级)
      const { meta, data } = await this.$axios.get('categories?type=2')
      if (meta.status === 200) {
        this.parentList = data
      }
    },
    async addCategory () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('categories', {
          cat_name: this.form.cat_name,
          cat_level: this.form.cat_pid.length,
          cat_pid: this.form.cat_pid.slice(-1).toString() || 0
        })
        if (meta.status === 201) {
          this.$refs.form.resetFields()
          this.dialogVisible = false
          this.getCategoriesList()
        }
      } catch {
        return false
      }
    }
  },
  created () {
    this.getCategoriesList()
  }
}
</script>

<style>

</style>
