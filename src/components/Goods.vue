<template>
  <div class="goods">
    <el-button type="success" @click='toAdd'>添加商品</el-button>

    <el-table :data='goodList'>
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间">
        <template v-slot='{row}'>
          {{row.upd_time | timeFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" circle plain icon="el-icon-edit" size="small"></el-button>
          <el-button type="danger" circle plain icon="el-icon-delete" size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodList: [],
      pagesize: 10,
      pagenum: 1,
      total: 0
    }
  },
  methods: {
    async getGoodList () {
      const { meta, data } = await this.$axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      console.log(meta, data)
      if (meta.status === 200) {
        this.goodList = data.goods
        this.total = data.total
      }
    },
    indexMethod (index) {
      return index + 1 + (this.pagenum - 1) * this.pagesize
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.getGoodList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getGoodList()
    },
    toAdd () {
      this.$router.push('/goods-add')
    }
  },
  created () {
    this.getGoodList()
  }
}
</script>

<style>

</style>
