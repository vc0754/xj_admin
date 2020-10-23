<template>
  <section class="wrap">
    <div class="breadcrumb">
      <span>当前位置：</span>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ channel_name }}订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-form ref="form" :model="form" label-width="85px" class="formDaterange bg-white flex flex-x-between flex-y-bottom">
      <div class="flex-grow">
        <div class="flex flex-wrap">
          <el-form-item label="订单编号：" class="m-r-20">
            <el-input v-model="form.sn" placeholder="请输入订单编号" style="width:260px;"></el-input>
          </el-form-item>
          
          <el-form-item label="商品标题：" class="m-r-20">
            <el-input v-model="form.name" placeholder="请输入商品标题" style="width:260px;"></el-input>
          </el-form-item>
          
          <el-form-item label="下单用户：">
            <el-select v-model="form.region" style="width:105px;">
              <el-option label="用户昵称" value="nickName"></el-option>
              <el-option label="手机号码" value="phone"></el-option>
            </el-select>
            <el-input v-model="form.input" placeholder="请输入内容" style="width:260px;"></el-input>
          </el-form-item>
        </div>

        <el-row>
          <el-col :span="12">
            <el-form-item label="付款时间：" style="margin: 0;">
              <el-date-picker v-model="form.date" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

      </div>
      <el-button type="primary" round @click="query">搜索</el-button>
    </el-form>

    <div class="formTable bg-white" style="padding: 30px 60px;">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="`${item.label}（${item.num}）`" :name="`tab${item.value}`" v-for="(item, index) in statuses" :key="index"></el-tab-pane>
      </el-tabs>
      
      <el-table stripe :data="items" v-loading="loading" style="width: 100%">
        <el-table-column prop="parentOrderNumber" label="订单号" width="180"></el-table-column>
        <el-table-column prop="goodsInfo" label="商品标题" width="260"></el-table-column>

        <el-table-column label="付款金额" width="120">
          <template slot-scope="scope">
            {{ scope.row.paymentMoney | fixed2 }}元
          </template>
        </el-table-column>

        <el-table-column prop="settlementAmount" label="税后佣金" width="120"></el-table-column>
        <el-table-column prop="commissionRate" label="佣金比例" width="120"></el-table-column>

        <el-table-column label="自购佣金" width="120">
          <template slot-scope="scope">
            {{ scope.row.userMoney | fixed2 }}元
          </template>
        </el-table-column>

        <el-table-column prop="nickName" label="自购用户" width="150"></el-table-column>
        <el-table-column prop="orderState" label="订单状态" width="116"></el-table-column>

        <el-table-column label="付款时间" min-width="170">
          <template slot-scope="scope">
            {{ scope.row.createDateTime | date }}
          </template>
        </el-table-column>

        <el-table-column label="结算时间" min-width="170">
          <template slot-scope="scope">
            {{ scope.row.settlementTime | date }}
          </template>
        </el-table-column>
      </el-table>
      
      <div class="flex flex-x-right p-t-40 p-b-10">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum">
        </el-pagination>
      </div>
    </div>

    <!-- <pre>{{ items }}</pre> -->
  </section>
</template>

<script>
import moment from 'moment'
export default {
  name: 'OrderListView',
  components: {},
  data () {
    return {
      form: {
        sn: '',
        name: '',
        region: 'nickName',
        input: '',
        date: []
      },
      activeName: 'tab0',
      statuses: [
        { label: '所有订单', value: 0, num: 0 },
        { label: '已付款', value: 1, num: 0 },
        { label: '已结算', value: 2, num: 0 },
        { label: '已失效', value: 3, num: 0 }
      ],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalNum: 0,
      items: []
    }
  },
  filters: {
    fixed2(val) {
      if (!val) return 0
      return val.toFixed(2)
    },
    date(val) {
      // return moment(val).format('YYYY-MM-DD HH:mm')
      return val
    }
  },
  computed: {
    channel_id() {
      return 3
    },
    channel_name() {
      return this.channel_id == 1 ? '淘宝' : this.channel_id == 2 ? '京东' : '拼多多'
    }
  },
  methods: {
    query () {
      this.loading = true
      this.$http.post('/api/Order/GetOrdersPage', {
        parentOrderNumber: this.form.sn,
        goodsInfo: this.form.name,
        mobile: this.form.region === 'phone' && this.form.input || '',
        nickName: this.form.region === 'nickName' && this.form.input || '',
        startTime: this.form.date && this.form.date.length && moment(this.form.date[0]).format('YYYY-MM-DD') || '',
        endTime: this.form.date && this.form.date.length && moment(this.form.date[1]).format('YYYY-MM-DD') || '',
        orderState: this.activeName.substring(3),
        origin: this.channel_id,
        page: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        this.items = res.data.items
        this.totalNum = res.data.totalNum
        this.statuses[0].num = res.data.allCount
        this.statuses[1].num = res.data.count1
        this.statuses[2].num = res.data.count2
        this.statuses[3].num = res.data.count3
        this.loading = false
        // console.log(res)
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
    },
  },
  watch: {
    channel_id() {
      this.query()
    }
  },
  mounted () {
    this.query()
  },
  beforeCreate () {
  },
  beforeDestroy () {
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
