<template>
  <div class="goodsAdd">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>

     <el-tabs tab-position="left" @tab-click='handleClick' v-model="activeName">
        <el-tab-pane label="基本信息" name="tab0">
          <el-form :model="form" label-width="80px">
            <el-form-item label="商品名称">
              <el-input placeholder="请输入商品名称" v-model="form.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input placeholder="请输入商品价格" v-model="form.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input placeholder="请输入商品重量" v-model="form.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input placeholder="请输入商品数量" v-model="form.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
              v-model="form.goods_cat"
              :options="options"
              :props="props"
            ></el-cascader>
            </el-form-item>
            <el-form-item label="是否促销">
              <el-radio v-model="form.is_promotion" :label="true">是</el-radio>
              <el-radio v-model="form.is_promotion" :label="false">否</el-radio>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="next">下一步</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="tab1">
          <el-upload
            action="http://localhost:8888/api/private/v1/upload"
            list-type="picture-card"
            :headers="headers"
            multiple
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :on-preview="handlePreview"
          ><i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <el-button type="primary" @click="next">下一步</el-button>

        </el-tab-pane>
        <el-tab-pane label="商品内容" name="tab2">
          <quill-editor v-model="form.goods_introduce"></quill-editor>
          <el-button type="primary" @click="addProduct">添加</el-button>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      activeName: 'tab0',
      form: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        is_promotion: false
      },
      options: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      headers: {
        Authorization: localStorage.getItem('token')
      },
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  methods: {
    handleClick (tab) {
      // console.log(tab)
      this.active = +tab.index
    },
    next () {
      this.active++
      this.activeName = 'tab' + this.active
    },
    async getCategoryList () {
      // 加载父级的分类数据（加载2级）
      const { meta, data } = await this.$axios.get('categories?type=3')
      // console.log(meta, data)
      if (meta.status === 200) {
        this.options = data
      }
    },
    handleRemove (file, fileList) {
      // 删除掉的那张图片的临时路径
      console.log(fileList)
      this.form.pics = this.form.pics.filter(item => item.pic !== file.response.data.tmp_path)
    },
    handlePreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleSuccess ({ meta, data }) {
      if (meta.status === 200) {
        // console.log(data)
        this.form.pics.push({ pic: data.tmp_path })
      }
    },
    async addProduct () {
      const { meta } = await this.$axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join()
      })
      console.log(meta)
      if (meta.status === 201) {
        this.$router.push('/goods')
        this.$message.success('添加成功')
      }
    }
  },
  created () {
    this.getCategoryList()
  }
}
</script>

<style lang='scss' scoped>
  // 1. 给组件中所有的元素添加一个自定义的属性 （仅限于组件有存在的元素）
  // 2. 给所有的样式添加 属性选择器
  // 深度选择器： 希望组件的样式能够影响到子组件生成的结构的样式
  // css  .father >>> .son {}
  // less  .father {  /deep/ .son{} }
  // scss  .father { ::v-deep .son{} }
.quill-editor {
  background-color: #fff;
  ::v-deep .ql-container {
    height: 300px;
  }
}
</style>
