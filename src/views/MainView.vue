<template>
  <section class="wrap">
    <div class="breadcrumb">
      <span>当前位置：</span>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-row :gutter="28" class="row01" style="margin-bottom: 28px;">
      <el-col :span="6">
        <div class="bg-white">
          <div class="flex flex-column">
            <span class="fs-32 num">{{ data.totalMoney }}</span>
            <span>总成交额</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="bg-white">
          <div class="flex flex-column">
            <span class="fs-32 num">{{ data.totalCommission }}</span>
            <span>总佣金额</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="bg-white">
          <div class="flex flex-column">
            <span class="fs-32 num">{{ data.todayMoney }}</span>
            <span>今日成交额</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="bg-white">
          <div class="flex flex-column">
            <span class="fs-32 num">{{ data.userNum1 }}</span>
            <span>用户量</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="row02 bg-white" style="margin-bottom: 28px;">
      <el-row :gutter="28">
        <el-col :span="6">
          <div class="bg-white padding-30 flex flex-column">
            <span class="fs-26 num">{{ data.yesterdayOrder }}</span>
            <span>昨日订单数</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="bg-white padding-30 flex flex-column">
            <span class="fs-26 num">{{ data.todayOrder }}</span>
            <span>今日订单数</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="bg-white padding-30 flex flex-column">
            <span class="fs-26 num">{{ data.yesterday }}</span>
            <span>昨日佣金</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="bg-white padding-30 flex flex-column">
            <span class="fs-26 num">{{ data.today }}</span>
            <span>今日佣金</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-card shadow="never">
      流量趋势
    </el-card>
    
    <!-- <pre>{{ data }}</pre> -->
  </section>
</template>

<script>
export default {
  name: 'MainView',
  components: {},
  data () {
    return {
      data: {}
    }
  },
  computed: {
  },
  methods: {
    query () {
      this.$http.post('/api/Home/GetTotalStatistics').then(res => {
        this.data = res.data
      }).catch(err => {
        this.$message.error(err.data.message)
      })
    }
  },
  watch: {
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