<template>
  <section class="wrap">
    <div class="breadcrumb">
      <span>当前位置：</span>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>普通用户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-form ref="form" :model="form" class="formDaterange bg-white flex flex-x-between flex-y-center">
      <div>
        <el-form-item label="" style="margin: 0;">
          <el-select v-model="form.region" style="width:105px;">
            <el-option label="用户昵称" value="nickName"></el-option>
            <el-option label="手机号码" value="phone"></el-option>
          </el-select>
          <el-input v-model="form.input" placeholder="请输入内容" style="width:260px;"></el-input>
        </el-form-item>
      </div>
      <el-button type="primary" round @click="query">搜索</el-button>
    </el-form>

    <div class="formTable bg-white" style="padding: 30px 60px;">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="`${item.label}（${item.num}）`" :name="`tab${item.value}`" v-for="(item, index) in statuses" :key="index"></el-tab-pane>
      </el-tabs>

      <el-table stripe :data="items" v-loading="loading" style="width: 100%">
        <el-table-column prop="userName" label="用户名" min-width="100"></el-table-column>
        <el-table-column prop="authorize" label="授权账号" min-width="130"></el-table-column>
        <el-table-column prop="invitation" label="APP邀请码" min-width="90"></el-table-column>
        <el-table-column prop="phone" label="手机号码" min-width="120"></el-table-column>

        <el-table-column label="等级">
          <template slot-scope="scope">
            {{ scope.row.userRole == 1 ? '会员' : scope.row.userRole == 2 ? '团长' : '高级团长' }}
          </template>
        </el-table-column>

        <el-table-column prop="parentNickName" label="推荐人"></el-table-column>

        <el-table-column label="账户余额">
          <template slot-scope="scope">
            {{ scope.row.allMoney | fixed2 }}元
          </template>
        </el-table-column>

        <el-table-column label="注册时间" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.regDateTime | date }}
          </template>
        </el-table-column>

        <el-table-column prop="isUserFreeze" label="状态">
          <template slot-scope="scope">
            {{ scope.row.isUserFreeze === 0 ? '未冻结' : '冻结' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <router-link :to="`/user/detail?id=${scope.row.userId}&name=${scope.row.nickName}`">明细</router-link>
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
  name: 'UserListView',
  components: {},
  data () {
    return {
      form: {
        input: '',
        region: 'nickName',
      },
      activeName: 'tab-1',
      statuses: [
        { label: '全部', value: -1, num: 0 },
        { label: '会员', value: 1, num: 0 },
        { label: '团长', value: 2, num: 0 },
        { label: '高级团长', value: 3, num: 0 }
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
  },
  methods: {
    ...mapActions([ USER_SIGNOUT ]),
    query () {
      this.loading = true
      let params = {
        nickName: this.form.region === 'nickName' && this.form.input || '',
        phone: this.form.region === 'phone' && this.form.input || '',
        CompanyName: '',
        LevelId: 3,
        UserRole: this.activeName.substring(3),
        page: this.currentPage,
        pageSize: this.pageSize
      }
      this.$http.post('/api/UserInfo/GetUserList', params).then(res => {
        this.items = res.data.items
        this.totalNum = res.data.totalNum
        this.statuses[0].num = res.data.allCount
        this.statuses[1].num = res.data.count1
        this.statuses[2].num = res.data.count2
        this.statuses[3].num = res.data.count3
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.data.message)
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
    },
  },
  watch: {
  },
  mounted () {
    this.query()
  }
}
</script>