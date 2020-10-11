<template>
  <section class="wrap">
    <div class="breadcrumb">
      <span>当前位置：</span>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <!-- <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item> -->
      </el-breadcrumb>
    </div>

    <!-- <el-page-header @back="goBack" content="详情页面"></el-page-header> -->
  </section>
</template>

<script>
export default {
  name: 'MainView',
  components: {},
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    query () {
      this.$http.post('/api/Home/GetTotalStatistics').then(res => {
        console.log(res)
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

<style lang="less" scoped>
.container-fluid {
  padding-top: 30px;
}

.breadcrumb {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
  display: flex; align-items: center;
}
</style>
