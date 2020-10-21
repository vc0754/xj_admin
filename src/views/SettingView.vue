<template>
  <section class="wrap full-height">
    <div class="breadcrumb">
      <span>当前位置：</span>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>APP 管理</el-breadcrumb-item>
        <el-breadcrumb-item>APP 设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="bg-white formWrap">
      <el-form ref="form" :model="form" label-width="100px">
        <div>
          <el-form-item label="导师微信号：" style="margin-bottom: 28px;">
            <el-input value="" v-model="form.serviceWeChat" style="width:480px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" round @click="submit">保存</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- <pre>{{ form }}</pre> -->

  </section>
</template>

<script>
export default {
  name: 'SettingView',
  components: {},
  data () {
    return {
      form: {}
    }
  },
  computed: {
  },
  methods: {
    query() {
      this.$http.post('/api/System/GetBaseConfigList').then(res => {
        this.form = res.data
      }).catch(err => {
        this.$message.error(err.data.message)
      })
    },
    submit() {
      this.$http.post('/api/System/UpdateBaseConfig', this.form).then(res => {
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.data.message)
      })
    }
  },
  watch: {
  },
  mounted() {
    this.query()
  },
}
</script>