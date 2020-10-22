<template>
  <section class="wrap">
    <div class="breadcrumb">
      <span>当前位置：</span>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据账单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-form ref="form" :model="form" label-width="55px" class="formDaterange bg-white flex flex-x-between flex-y-center">
      <div>
        <el-form-item label="时间：" style="margin: 0;">
          <el-date-picker v-model="date" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" style="width:307px;">
          </el-date-picker>
        </el-form-item>
      </div>
      <el-button type="primary" round @click="query">搜索</el-button>
    </el-form>

    <div class="formTable bg-white" style="padding: 30px 60px;">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="淘宝" name="t1"></el-tab-pane>
        <el-tab-pane label="拼多多" name="t2"></el-tab-pane>
        <el-tab-pane label="东京" name="t3"></el-tab-pane>
      </el-tabs>
      
      <el-table stripe :data="items" v-loading="loading" style="width: 100%">

        <el-table-column label="总成交额" width="180">
          <template slot-scope="scope">
            {{ scope.row.totalDealAmount | fixed2 }}元
          </template>
        </el-table-column>

        <el-table-column label="总佣金" width="180">
          <template slot-scope="scope">
            {{ scope.row.totalCommission | fixed2 }}元
          </template>
        </el-table-column>

        <el-table-column label="团队获得佣金">
          <template slot-scope="scope">
            {{ scope.row.subsidiaryNeedPayCommission | fixed2 }}元
          </template>
        </el-table-column>

        <el-table-column label="获得利润">
          <template slot-scope="scope">
            {{ scope.row.subsidiaryProfit | fixed2 }}元
          </template>
        </el-table-column>

        <el-table-column prop="totalOrdersCount" label="结算订单数"></el-table-column>
        <el-table-column prop="dateRange" label="日期" min-width="100"></el-table-column>
      </el-table>
      
      <div class="flex flex-x-right p-t-40 p-b-10">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- <pre>{{ items }}</pre>
    <pre>{{ date }}</pre> -->

  </section>
</template>

<script>
import moment from 'moment'
export default {
  name: 'StatisticsView',
  components: {},
  data () {
    return {
      form: {
        name: '',
      },
      date: [],
      activeName: 't1',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      items: [],
      loading: false
    }
  },
  filters: {
    fixed2(val) {
      if (!val) return 0
      return val.toFixed(2)
    }
  },
  computed: {
  },
  methods: {
    query () {
      this.loading = true
      this.$http.post('/api/Order/GetDataBillsStatistics', {
        startTime: this.date && this.date.length && moment(this.date[0]).format('YYYY-MM-DD') || '',
        endTime: this.date && this.date.length && moment(this.date[1]).format('YYYY-MM-DD') || '',
        shoppingPlatformId: this.activeName.substring(1),
        page: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        // console.log(res)
        this.items = res.data.items
        this.total = res.data.totalNum
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.data.message)
      })
    },
    handleClick() {
      this.query()
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.query()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.query()
    }
  },
  watch: {
  },
  mounted() {
    this.query()
  }
}
</script>

<style lang="less" scoped>
.container-fluid {
  padding-top: 30px;
}

.breadcrumb {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
  display: flex; align-items: center;
}
</style>
