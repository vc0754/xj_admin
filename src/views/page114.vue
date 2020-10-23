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

      <div class="formTable taobaoTable">
        <el-table stripe :data="tableData" style="width: 100%">
          <el-table-column prop="aliMaMaName" label="淘宝号" width="250"></el-table-column>
          <el-table-column prop="updateDateTime" label="授权到期时间" width="230"></el-table-column>
          <el-table-column prop="commonPid" label="渠道PID" width="350"></el-table-column>
          <el-table-column prop="isChannel" label="是否开启渠道模式" width="220"></el-table-column>
          <el-table-column prop="yxDayQty" label="授权剩余天数" width="220"></el-table-column>
          <el-table-column label="操作">
            <span @click="on_auth">更新授权</span>
            <span @click="on_channel_open" class="m-l-20">开启渠道模式</span>
          </el-table-column>
        </el-table>
      </div>

    </div>

  </section>
</template>

<script>
export default {
  name: 'Auth',
  components: {},
  data () {
    return {
      url: '',
      tableData: []
    }
  },
  computed: {
  },
  methods: {
    query () {
      // 获取淘宝授权信息
      this.$http.post('/api/UserAuth/GetAliMaMaUserList').then(res => {
        console.log(res)
      }).catch(err => {
        this.$message.error(err.data.message)
      })
    },
    on_auth() {
      // 授权回调链接
      this.$http.post('/api/UserAuth/GetRedirectUrl', { id: 0 }).then(res => {
        this.url = res.data
        window.location = res.data
      }).catch(err => {
        this.$message.error(err.data.message)
      })
    },
    on_channel_open() {
      // 开启渠道模式
      this.$http.post('/api/UserAuth/UpdateAliMaMaUser').then(res => {
        console.log(res)
        this.query()
      }).catch(err => {
        this.$message.error(err.data.message)
      })
    }
  },
  watch: {
  },
  mounted () {
    this.query()
    // this.on_auth()
    // this.on_channel_open()
  }
}
</script>