<template>
  <section class="wrap">
    <div class="breadcrumb">
      <span>当前位置：</span>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>普通用户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="formTable bg-white" style="padding: 30px 60px;">
      <h2>{{ user.nickName }}（{{ user.phone }}）的提现记录</h2>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="订单明细" name="tab1">
          <el-table stripe :data="tableData.tab1.items" v-loading="loading" style="width: 100%">
            <el-table-column prop="nickName" label="用户名" width="293"></el-table-column>
            <el-table-column prop="orderRemark" label="订单说明" width="380"></el-table-column>

            <el-table-column label="佣金" width="280">
              <template slot-scope="scope">
                {{ scope.row.settlementAmount | fixed2 }}元
              </template>
            </el-table-column>

            <el-table-column prop="createDateTime" label="付款时间" width="300"></el-table-column>
            <el-table-column prop="orderState" label="订单状态"></el-table-column>
          </el-table>
          
          <div class="flex flex-x-right p-t-40 p-b-10">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="tableData.tab1.currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="tableData.tab1.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData.tab1.totalNum">
            </el-pagination>
          </div>

        </el-tab-pane>
        <el-tab-pane label="用户提现" name="tab2">
          <el-table stripe :data="tableData.tab2.items" v-loading="loading" style="width: 100%">
            <el-table-column prop="nickName" label="用户名" width="200"></el-table-column>
            <el-table-column prop="tiXianTypeName" label="提现类型" width="200"></el-table-column>

            <el-table-column label="提现金额" width="200">
              <template slot-scope="scope">
                {{ scope.row.amount | fixed2 }}元
              </template>
            </el-table-column>

            <el-table-column prop="alipayOrderNo" label="支付宝交易订单号" width="210"></el-table-column>
            <el-table-column prop="createDateTime" label="申请时间" width="170"></el-table-column>
            <el-table-column prop="operateTime" label="处理时间" width="170"></el-table-column>
            <el-table-column label="提现状态" width="180">
              <template slot-scope="scope">
                {{ scope.row.istate == 1 ? '提现成功' : scope.row.istate == 2 ? '驳回' : '申请中' }}
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="拒绝理由"></el-table-column>
          </el-table>
          
          <div class="flex flex-x-right p-t-40 p-b-10">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="tableData.tab2.currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="tableData.tab2.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData.tab2.totalNum">
            </el-pagination>
          </div>

        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- <pre>{{tableData}}</pre> -->
  </section>
</template>

<script>
import moment from 'moment'
export default {
  name: 'UserDetailView',
  components: {},
  data () {
    return {
      user: {},
      activeName: 'tab1',
      loading: false,
      tableData: {
        tab1: {
          currentPage: 1,
          pageSize: 10,
          totalNum: 0,
          loading: false,
          items: []
        },
        tab2: {
          currentPage: 1,
          pageSize: 10,
          totalNum: 0,
          loading: false,
          items: []
        }
      }
    }
  },
  filters: {
    fixed2(val) {
      if (!val) return 0
      return val.toFixed(2)
    },
    date(val) {
      return moment(val).format('YYYY-MM-DD HH:mm')
    }
  },
  computed: {
    id() {
      return parseInt(this.$route.query.id)
    },
    name() {
      return this.$route.query.name
    }
  },
  methods: {
    goback() {
      this.$router.go(-1)
    },
    queryUser() {
      this.$http.post('/api/UserInfo/GetUserList', {
        NickName: this.name
      }).then(res => {
        this.user = res.data.items[0]
      })
    },
    query() {
      this.loading = true
      this.$http.post('/api/Order/GetUserOrdersPage', {
        userBuyerId: this.id,
        page: this.tableData.tab1.currentPage,
        pageSize: this.tableData.tab1.pageSize
      }).then(res => {
        this.$set(this.tableData.tab1, 'items', res.data.items)
        this.$set(this.tableData.tab1, 'totalNum', res.data.totalNum)
        // console.log(res)
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.data.message)
      })
    },
    query2() {
      this.loading = true
      this.$http.post('/api/TiXian/GetTiXianRecordPage', {
        nickName: '',
        phone: '',
        userBuyerId: this.id,
        levelId: 1,
        tixianType: 0,
        istate: -1,
        page: this.tableData.tab2.currentPage,
        pageSize: this.tableData.tab2.pageSize
      }).then(res => {
        this.$set(this.tableData.tab2, 'items', res.data.items)
        this.$set(this.tableData.tab2, 'totalNum', res.data.totalNum)
        // console.log(res)
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.data.message)
      })
    },
    handleClick() {
      if (this.activeName === 'tab1') this.query()
      if (this.activeName === 'tab2') this.query2()
    },
    handleSizeChange(val) {
      if (this.activeName === 'tab1') {
        this.$set(this.tableData.tab1, 'currentPage', 1)
        this.$set(this.tableData.tab1, 'pageSize', val)
        this.query()
      }
      if (this.activeName === 'tab2') {
        this.$set(this.tableData.tab2, 'currentPage', 1)
        this.$set(this.tableData.tab2, 'pageSize', val)
        this.query2()
      }
    },
    handleCurrentChange(val) {
      if (this.activeName === 'tab1') {
        this.$set(this.tableData.tab1, 'currentPage', val)
        this.query()
      }
      if (this.activeName === 'tab2') {
        this.$set(this.tableData.tab2, 'currentPage', val)
        this.query2()
      }
    }
  },
  watch: {
  },
  mounted () {
    this.query()
    this.queryUser()
  }
}
</script>