<template>
  <section class="wrap">
    <div class="breadcrumb">
      <span>当前位置：</span>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>提现管理</el-breadcrumb-item>
        <el-breadcrumb-item>提现列表</el-breadcrumb-item>
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
        <el-table-column prop="nickName" label="用户昵称" width="150"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="140"></el-table-column>
        <el-table-column prop="alipay" label="支付宝账号" width="150"></el-table-column>
        <el-table-column prop="userName" label="姓名" width="130"></el-table-column>

        <el-table-column label="提现金额" width="140">
          <template slot-scope="scope">
            {{ scope.row.amount | fixed2 }}元
          </template>
        </el-table-column>

        <el-table-column prop="tiXianTypeName" label="提现类型" width="150"></el-table-column>
        <el-table-column prop="alipayOrderNo" label="支付宝交易号" width="165"></el-table-column>

        <el-table-column label="提现状态" width="90">
          <template slot-scope="scope">
            {{ scope.row.istate == 1 ? '提现成功' : scope.row.istate == 2 ? '驳回' : '申请中' }}
          </template>
        </el-table-column>

        <el-table-column label="申请提现时间" width="140">
          <template slot-scope="scope">
            {{ scope.row.createDateTime | date }}
          </template>
        </el-table-column>

        <el-table-column label="处理时间" width="140">
          <template slot-scope="scope">
            {{ scope.row.operateTime }}
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="140">
          <template slot-scope="scope">
            <div class="blockspan">
              <span @click="modify(scope.row.tiXianBuyerRecordId)" v-if="scope.row.istate == 1">修改支付宝交易号</span>
              <template v-if="scope.row.istate == 0">
                <span @click="payment(scope.row.tiXianBuyerRecordId)">打款</span>
                <span class="m-l-15" @click="reject(scope.row.tiXianBuyerRecordId)">驳回</span>
              </template>
              <router-link :to="`/withdrawal/detail?id=${scope.row.userBuyerId}&name=${scope.row.nickName}`">提现记录</router-link>
            </div>
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

    <el-dialog title="打款修改支付宝交易号" :visible.sync="dialogVisibleModify" width="460px" class="d1">
      <el-form ref="formStore" :model="form_alipay" label-width="130px">
        <div style="padding: 35px 0">
        <el-form-item label="支付宝交易号">
          <el-input v-model="form_alipay.sn" placeholder="" />
        </el-form-item>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleModify = false" round>取 消</el-button>
        <el-button type="primary" @click="on_update_alipay_sn" round>确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="驳回" :visible.sync="dialogVisibleReject" width="460px" class="d1">
      <el-form ref="formStore" :model="form_reject" label-width="130px">
        <el-form-item label="用户昵称">
          <span>{{ form_reject.nickname }}</span>
        </el-form-item>
        
        <el-form-item label="支付宝账号">
          <span>{{ form_reject.alipay }}</span>
        </el-form-item>
        
        <el-form-item label="姓名">
          <span>{{ form_reject.name }}</span>
        </el-form-item>
        
        <el-form-item label="提现金额">
          <span>{{ form_reject.amount }}</span>
        </el-form-item>
        
        <el-form-item label="驳回理由">
          <el-input type="textarea" v-model="form_reject.remark" placeholder="" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleReject = false" round>取 消</el-button>
        <el-button type="primary" @click="on_reject" round>确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="打款" :visible.sync="dialogVisiblePayment" width="460px" class="d1">
      <el-form ref="formStore" :model="form_payment" label-width="130px">
        <el-form-item label="用户昵称">
          <span style="color: rgba(0, 0, 0, 0.85);">{{ form_payment.nickname }}</span>
        </el-form-item>
        
        <el-form-item label="支付宝账号">
          <span style="color: rgba(0, 0, 0, 0.85);">{{ form_payment.alipay }}</span>
        </el-form-item>
        
        <el-form-item label="姓名">
          <span style="color: rgba(0, 0, 0, 0.85);">{{ form_payment.name }}</span>
        </el-form-item>
        
        <el-form-item label="提现金额">
          <span style="color: rgba(0, 0, 0, 0.85);">{{ form_payment.amount }}</span>
        </el-form-item>
        
        <el-form-item label="支付宝交易号">
          <el-input v-model="form_payment.sn" placeholder="" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblePayment = false" round>取 消</el-button>
        <el-button type="primary" @click="on_payment" round>确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import moment from 'moment'
export default {
  name: 'UserListView',
  components: {},
  data () {
    return {
      dialogVisibleModify: false,
      dialogVisibleReject: false,
      dialogVisiblePayment: false,
      form: {
        input: '',
        region: 'nickName',
      },
      form_alipay: {
        id: '',
        sn: ''
      },
      form_payment: {
        id: '',
        nickname: '',
        alipay: '',
        name: '',
        amount: '',
        sn: ''
      },
      form_reject: {
        id: '',
        nickname: '',
        alipay: '',
        name: '',
        amount: '',
        remark: ''
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
  filters: {
    fixed2(val) {
      if (!val) return 0
      return val.toFixed(2)
    },
    date(val) {
      if (val == '---') return val
      return moment(val).format('YYYY-MM-DD HH:mm')
    }
  },
  computed: {
  },
  methods: {
    modify(id) {
      this.form_alipay.id = id
      this.dialogVisibleModify = true
    },
    reject(id) {
      let item = this.items.find(item => item.tiXianBuyerRecordId === id)
      this.form_reject.id = id
      this.form_reject.alipay = item.alipay
      this.form_reject.amount = item.amount
      this.form_reject.name = item.userName
      this.form_reject.nickname = item.nickName
      this.dialogVisibleReject = true
    },
    payment(id) {
      let item = this.items.find(item => item.tiXianBuyerRecordId === id)
      this.form_payment.id = id
      this.form_payment.alipay = item.alipay
      this.form_payment.amount = item.amount
      this.form_payment.name = item.userName
      this.form_payment.nickname = item.nickName
      this.dialogVisiblePayment = true
    },
    handleClose() {
      // done
      // this.$confirm('确认关闭？').then(_ => {
      //   done();
      // }).catch(_ => {});
    },
    query() {
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
        this.statuses[1].num = res.data.count0
        this.statuses[2].num = res.data.count1
        this.statuses[3].num = res.data.count2
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
    },
    on_update_alipay_sn() {
      this.$http.post('/api/TiXian/TiXianRecordUpdate', {
        id: this.form_alipay.id,
        AlipayOrderNo: this.form_alipay.sn
      }).then(res => {
        this.dialogVisibleModify = false
        this.$message.success(res.message)
        this.query()
      }).catch(err => {
        // this.loading = false
        this.$message.error(err.data.message)
      })
    },
    on_payment() {
      this.$http.post('/api/TiXian/TiXianRecordPass', {
        id: this.form_payment.id,
        AlipayOrderNo: this.form_payment.sn
      }).then(res => {
        this.dialogVisiblePayment = false
        this.$message.success(res.message)
        this.query()
      }).catch(err => {
        // this.loading = false
        this.$message.error(err.data.message)
      })
    },
    on_reject() {
      this.$http.post('/api/TiXian/TiXianRecordRefuse', {
        id: this.form_reject.id,
        remark: this.form_reject.remark
      }).then(res => {
        this.dialogVisibleReject = false
        this.$message.success(res.message)
        this.query()
      }).catch(err => {
        // this.loading = false
        this.$message.error(err.data.message)
      })
    }
  },
  watch: {
  },
  mounted () {
    this.query()
  }
}
</script>

<style lang="less" scoped>
.blockspan {
  span { color: #1890FF; cursor: pointer;}
  a { display: block;}
}
</style>