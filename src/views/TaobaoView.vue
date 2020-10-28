<template>
  <section class="wrap full-height">
    <div class="breadcrumb">
      <span>当前位置：</span>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>账号管理</el-breadcrumb-item>
        <el-breadcrumb-item>淘宝账号</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="bg-white" style="padding: 50px 58px;">
      <h3 class="section_title">授权账号信息</h3>
      
      <div class="authTaobao" v-if="!is_auth">
        <el-button type="info" @click="on_auth">
          <img src="../assets/icon_tb.png" alt="">
          淘宝账号登录授权
        </el-button>
        <div class="flex flex-y-center">
          <img src="../assets/icon_click.png" alt="">
          <span>请点击授权</span>
        </div>
      </div>

      <div class="formTable taobaoTable" v-else>
        <el-table stripe :data="tableData" style="width: 100%">
          <el-table-column prop="aliMaMaName" label="淘宝号" min-width="180"></el-table-column>

          <el-table-column label="授权到期时间" width="230">
            <template slot-scope="scope">
              {{ scope.row.updateDateTime }}
              <!-- {{ scope.row.yxDayQty }} -->
            </template>
          </el-table-column>

          <el-table-column prop="commonPid" label="渠道PID" min-width="300"></el-table-column>

          <el-table-column label="是否开启渠道模式" width="220">
            <template slot-scope="scope">
              {{ scope.row.isChannel === 0 ? '否' : '是' }}
            </template>
          </el-table-column>

          <el-table-column prop="yxDayQty" label="授权剩余天数" min-width="180"></el-table-column>

          <el-table-column label="操作" min-width="265">
            <template slot-scope="scope">
              <span class="blue" @click="on_auth">更新授权</span>
              <span class="blue m-l-20" @click="dialogVisible = true" v-if="!scope.row.commonPid">开启渠道模式</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>

    <el-dialog title="确认开启渠道模式" :visible.sync="dialogVisible" width="460px" class="d1">
      <div style="padding:0 25px 0 20px; line-height:1.85;">
        <h3 style="color: #333; font-size:16px;">重要提示：</h3>
        <p>1. 开启渠道模式后无法关闭</p>
        <p>2. 请勿使用淘客帐号授权渠道，淘客帐号为合作方无法用于授权，否则会导致后台淘宝号开启渠道授权失败！</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" round>取 消</el-button>
        <el-button type="primary" @click="on_channel_open" round>确 定</el-button>
      </span>
    </el-dialog>

  </section>
</template>

<script>
import { mapActions } from 'vuex'
import { USER_SIGNOUT } from '@/store/modules/user'
export default {
  name: 'TaoBao',
  components: {},
  data () {
    return {
      dialogVisible: false,
      is_auth: false,
      url: '',
      tableData: []
    }
  },
  computed: {
    state() {
      return this.$route.query.state
    },
    access_token() {
      return this.$route.query.access_token
    },
    taobao_user_nick() {
      return this.$route.query.taobao_user_nick
    }
  },
  methods: {
    ...mapActions([ USER_SIGNOUT ]),
    // dialog_closed() {
    //   this.query()
    // },
    query () {
      // 获取淘宝授权信息
      this.$http.post('/api/UserAuth/GetAliMaMaUserList').then(res => {
        if (res.data.length) {
          this.tableData = res.data
          this.is_auth = true
        }
      }).catch(err => {
        this.$message.error(err.data.message)
        if (err.data.message === '身份验证失败') {
          this.USER_SIGNOUT()
          this.$router.replace({ path: '/sign' })
        }
      })
    },
    on_auth() {
      // 授权回调链接
      // this.$router.replace('/taobao?access_token=700001005370f169d796ea2933ed698f93d3a8a2291fbd5f9165c3b6e064cac9d7d9c8c34015862&token_type=Bearer&expires_in=2592000&refresh_token=700011015376275a496579fc767e7acb35bd09de47a1fec131d0b13189d6d4058df0d8434015862&re_expires_in=0&r1_expires_in=2592000&r2_expires_in=86400&taobao_open_uid=AAEdElvRAHEQnKb_onzs640_&taobao_user_id=34015862&taobao_user_nick=%E7%B4%A2%E5%8D%A2%E6%A0%BC&w1_expires_in=2592000&w2_expires_in=300&state=xj_39_5&top_sign=5F4497BD1ADCFA363E6D0E7CA743310D')
      // 
      this.$http.post('/api/UserAuth/GetRedirectUrl', { id: 0 }).then(res => {
        this.url = res.data
        window.location = res.data
      }).catch(err => {
        this.$message.error(err.data.message)
        if (err.data.message === '身份验证失败') {
          this.USER_SIGNOUT()
          this.$router.replace({ path: '/sign' })
        }
      })
    },
    on_channel_open() {
      // 开启渠道模式
      this.$http.post('/api/UserAuth/UpdateAliMaMaUser').then(res => {
        console.log(res)
        this.dialogVisible = false
        this.query()
      }).catch(err => {
        this.$message.error(err.data.message)
        if (err.data.message === '身份验证失败') {
          this.USER_SIGNOUT()
          this.$router.replace({ path: '/sign' })
        }
      })
    },
    on_auth_callback() {
      this.$http.get('/api/UserAuth/AliMaMaUserAuth', {
        params: {
          state: this.state,
          access_token: this.access_token,
          taobao_user_nick: this.taobao_user_nick
        }
      }).then(() => {
        this.$router.replace({ path: '/taobao' })
        this.query()
      }).catch(err => {
        this.$message.error(err.data.message)
        if (err.data.message === '身份验证失败') {
          this.USER_SIGNOUT()
          this.$router.replace({ path: '/sign' })
        }
      })
    }
  },
  watch: {
    // access_token(val) {
    //   if (val) this.on_auth_callback()
    // }
  },
  mounted () {
    if (this.access_token && this.taobao_user_nick && this.state) {
      this.on_auth_callback()
    } else {
      this.query()
    }
    // this.on_auth()
    // this.on_channel_open()
  },
  // beforeCreate() {
  //   document.getElementsByTagName('body')[0].className = `${document.getElementsByTagName('body')[0].className} setting_wrap`
  // },
  // beforeDestroy() {
  //   document.body.removeAttribute('class', 'setting_wrap')
  // }
}
</script>

<style lang="less" scoped>
.blue { color: #1890FF; cursor: pointer;}
</style>