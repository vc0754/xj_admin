<template>
  <section class="wrap">
    <div class="breadcrumb">
      <span>当前位置：</span>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>提现管理</el-breadcrumb-item>
        <el-breadcrumb-item>提现列表</el-breadcrumb-item>
        <el-breadcrumb-item>提现记录</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="goback m-l-10" @click="goback">返回</span>
    </div>

    <div class="formTable bg-white" style="padding: 30px 60px;">
      <h2>{{ user.nickName }}（{{ user.phone }}）的提现记录</h2>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="`${item.label}（${item.num}）`" :name="`tab${item.value}`" v-for="(item, index) in statuses" :key="index"></el-tab-pane>
      </el-tabs>
      
      <el-table stripe :data="items" v-loading="loading" style="width: 100%">
        <el-table-column prop="nickName" label="用户名" width="252"></el-table-column>
        <el-table-column prop="tiXianTypeName" label="提现类型" width="220"></el-table-column>

        <el-table-column label="提现金额" width="220">
          <template slot-scope="scope">
            {{ scope.row.amount | fixed2 }}元
          </template>
        </el-table-column>

        <el-table-column prop="alipayOrderNo" label="支付宝交易订单号" width="240"></el-table-column>

        <el-table-column label="申请时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.createDateTime | date }}
          </template>
        </el-table-column>

        <el-table-column label="处理时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.operateTime }}
          </template>
        </el-table-column>

        <el-table-column label="提现状态" width="180">
          <template slot-scope="scope">
            {{ scope.row.istate == 1 ? '提现成功' : scope.row.istate == 2 ? '驳回' : '申请中' }}
          </template>
        </el-table-column>
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
import moment from 'moment'
import { mapActions } from 'vuex'
import { USER_SIGNOUT } from '@/store/modules/user'
export default {
  name: 'UserDetailView',
  components: {},
  data () {
    return {
      form: {
        input: '',
        region: '',
      },
      user: {},
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
      return this.$route.query.id
    },
    name() {
      return this.$route.query.name
    }
  },
  methods: {
    ...mapActions([ USER_SIGNOUT ]),
    goback() {
      this.$router.go(-1)
    },
    queryUser() {
      this.$http.post('/api/UserInfo/GetUserList', {
        NickName: this.name
      }).then(res => {
        this.user = res.data.items[0]
      }).catch(err => {
        this.$message.error(err.data.message)
        if (err.data.message === '身份验证失败') {
          this.USER_SIGNOUT()
          this.$router.replace({ path: '/sign' })
        }
      })
    },
    query () {
      this.loading = true
      let params = {
        nickName: this.form.region === 'nickName' && this.form.input || '',
        phone: this.form.region === 'phone' && this.form.input || '',
        userBuyerId: this.id,
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
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
        if (err.data.message === '身份验证失败') {
          this.USER_SIGNOUT()
          this.$router.replace({ path: '/sign' })
        }
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
    this.queryUser()
  }
}
</script>