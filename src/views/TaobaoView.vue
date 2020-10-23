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
              <span class="blue m-l-20" @click="on_channel_open" v-if="!scope.row.commonPid">开启渠道模式</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>

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
      is_auth: false,
      url: '',
      tableData: []
    }
  },
  computed: {
  },
  methods: {
    ...mapActions([ USER_SIGNOUT ]),
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
  },
  mounted () {
    this.query()
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