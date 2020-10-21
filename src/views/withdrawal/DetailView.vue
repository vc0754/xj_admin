<template>
  <section class="wrap">
    <div class="breadcrumb">
      <span>当前位置：</span>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>提现管理</el-breadcrumb-item>
        <el-breadcrumb-item>提现列表</el-breadcrumb-item>
        <el-breadcrumb-item>提现记录</el-breadcrumb-item>
      </el-breadcrumb>
      <span>返回</span>
    </div>

    <div class="formTable bg-white" style="padding: 30px 60px;">
      <h2>嘻街用户002（13656434586）的提现记录</h2>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="`${item.label}（${item.num}）`" :name="`tab${item.value}`" v-for="(item, index) in statuses" :key="index"></el-tab-pane>
      </el-tabs>
      
      <el-table stripe :data="items" v-loading="loading" style="width: 100%">
        <el-table-column prop="NickName" label="用户名" width="252"></el-table-column>
        <el-table-column prop="Remark" label="提现类型" width="220"></el-table-column>
        <el-table-column prop="Amount" label="提现金额" width="220"></el-table-column>
        <el-table-column prop="AlipayOrderNo" label="支付宝交易订单号" width="240"></el-table-column>
        <el-table-column prop="CreateDateTime" label="申请时间" width="200"></el-table-column>
        <el-table-column prop="OperateTime" label="处理时间" width="200"></el-table-column>
        <el-table-column prop="Istate" label="提现状态" width="180"></el-table-column>
      </el-table>

      <div class="flex flex-x-right p-t-40 p-b-10">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum">
        </el-pagination>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'UserDetailView',
  components: {},
  data () {
    return {
      form: {
        input: '',
        region: '',
      },
      activeName: 'tab-1',
      statuses: [
        { label: '全部', value: -1, num: 0 },
        { label: '审核中', value: 0, num: 0 },
        { label: '提现成功', value: 1, num: 0 },
        { label: '驳回', value: 2, num: 0 }
      ],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalNum: 0,
      items: []
    }
  },
  computed: {
  },
  methods: {
    query () {
      this.loading = true
      let params = {
        nickName: this.form.region === 'nickName' && this.form.input || '',
        phone: this.form.region === 'phone' && this.form.input || '',
        userBuyerId: '',
        levelId: 1,
        tixianType: 0,
        istate: this.activeName.substring(3),
        page: this.currentPage,
        pageSize: this.pageSize
      }
      this.$http.post('/api/TiXian/GetTiXianRecordPage', params).then(res => {
        this.items = res.data.items
        this.totalNum = res.data.totalNum
        this.statuses[0].num = res.data.allCount
        this.statuses[1].num = res.data.count1
        this.statuses[2].num = res.data.count2
        this.statuses[3].num = res.data.count3

        if(res.data.totalNum === 0) {
          this.items = [{
            "TiXianBuyerRecordId": 0,
            "UserBuyerId": 0,
            "TopUserId": 0,
            "Amount": 0,
            "TaxAmount": 0,
            "CreateDateTime": "2020-10-21T02:53:07.842Z",
            "Alipay": "string",
            "UserName": "string",
            "Phone": "string",
            "Istate": 0,
            "TiXianType": 0,
            "TiXianTypeName": "string",
            "Remark": "string",
            "OperateTime": "string",
            "IsFrozen": 0,
            "LastTiXian": 0,
            "BeforeTiXian": 0,
            "NickName": "string",
            "AlipayOrderNo": "string",
            "UserRole": 0,
            "UserRoleName": "string",
            "branchNickName": "string"
          }]
          this.totalNum = 1
        }
        this.loading = false
      }).catch(err => {
      this.loading = false
        this.$message.error(err.message)
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
  mounted () {
    this.query()
  }
}
</script>