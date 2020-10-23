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

    <el-card shadow="never" class="relative">
      <!-- 流量趋势 -->
      <div ref="echart_wrap" class="echart_wrap"></div>
      <ul class="echart_tip">
        <li>
          <div class="icon"></div>
          <span>新增注册量</span>
        </li>
        <li>
          <div class="icon"></div>
          <span>订单数量</span>
        </li>
      </ul>
    </el-card>
    
    <!-- <pre>{{ xAxis_data }}</pre> -->
  </section>
</template>

<script>
import echarts from "echarts";
import { mapActions } from 'vuex'
import { USER_SIGNOUT } from '@/store/modules/user'
export default {
  name: 'MainView',
  components: {},
  data () {
    return {
      data: {},
      chart: null,
      dataObj: this.value,
      colorArray: this.$store.state.colorArray
    }
  },
  computed: {
    xAxis_data() {
      let items = this.data.dayStatistics.map(item => {
        return item.day.substring(5)
      })
      return items
    },
    series_data_1() {
      let items = this.data.dayStatistics.map(item => {
        return item.list[0].count
      })
      return items
    },
    series_data_2() {
      let items = this.data.dayStatistics.map(item => {
        return item.list[1].count
      })
      return items
    }
  },
  methods: {
    ...mapActions([ USER_SIGNOUT ]),
    query () {
      this.$http.post('/api/Home/GetTotalStatistics').then(res => {
        this.data = res.data
        this.initCharts()
      }).catch(err => {
        this.$message.error(err.data.message)
        if (err.data.message === '身份验证失败') {
          this.USER_SIGNOUT()
          this.$router.replace({ path: '/sign' })
        }
      })
    },
    initCharts() {
      var base = +new Date(1968, 9, 3);
      var oneDay = 24 * 3600 * 1000;
      var date = [];

      var data = [Math.random() * 300];

      for (var i = 1; i < 20000; i++) {
        var now = new Date(base += oneDay);
        date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
        data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
      }

      this.charts = echarts.init(this.$refs['echart_wrap'])
      this.charts.setOption({
        title: {
          left: 'left',
          text: '流量趋势',
        },
        tooltip: {
          trigger: 'axis'
        },
        // legend: {
        //   textStyle: {
        //     color: '#FFFFF99'
        //   },
        //   icon: 'roundRect'
        // },
        xAxis: {
          data: this.xAxis_data,
          axisLine: {
            lineStyle: {
              color: '#cccccc'
            }
          },
          // name: '年-月'
          // type: 'category',
          // boundaryGap: false
        },
        yAxis: {
          type: 'value',
          // boundaryGap: [0, '100%']
          axisLine: {
            lineStyle: {
              color: '#ffffff'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#cccccc'
            }
          }
        },
        grid: {
          top: 86,
          left: 46,
          right: 46,
          bottom: "10%"
        },
        series: [
          {
            type: 'line',
            smooth: true,
            name: '新增注册量',
            color: '#9956FB',
            data: this.series_data_1
          },
          {
            type: 'line',
            smooth: true,
            name: '订单数量',
            color: '#EC4BD6',
            data: this.series_data_2
          },
        ]
      })
    },
    onResize() {
      if (this.charts) this.charts.resize()
    },
  },
  watch: {
    value() {
      this.dataObj = {}
      this.dataObj = this.value
      this.initCharts()
    }
  },
  mounted () {
    this.query()
    // this.$nextTick(() => {
    //   this.initCharts()
    // })
    window.addEventListener("resize", this.onResize, false)
  },
  beforeCreate () {
  },
  beforeDestroy() {
    if (!this.chart) return
    this.chart.dispose()
    this.chart = null
    window.removeEventListener("resize", this.onResize, false)
  }
}
</script>

<style lang="less" scoped>
.relative { position: relative;}
.echart_wrap { height: 480px;}
.echart_tip {
  color: rgba(0, 0, 0, 0.65);
  font-size: 12px;
  position: absolute; top: 31px; right: 46px;
  display: flex;
  li {
    margin-right: 20px;
    display: flex; align-items: center;
    &:first-child .icon {
      &::before {
        background: #9956FB;
      }
      &::after {
        background: #9956FB;
      }
    }
    &:last-child .icon {
      &::before {
        background: #EC4BD6;
      }
      &::after {
        background: #EC4BD6;
      }
    }
  }
  .icon {
    position: relative; padding: 0 15px;
    &::before {
      content: '';
      width: 26px; height: 2px; display: block;
      border-radius: 1px;
      position: absolute; top: 50%; left: 50%; z-index: 0;
      transform: translate3d(-50%, -50%, 0);
    }
    &::after {
      content: '';
      width: 12px; height: 12px; display: block;
      border: 2px solid #fff; border-radius: 50%;
      position: relative; z-index: 1;
    }
  }
}
</style>