<template>
  <section class="wrap full-height">
    <div class="breadcrumb">
      <span>当前位置：</span>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>提现管理</el-breadcrumb-item>
        <el-breadcrumb-item>提现设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="bg-white formWrap" style="padding: 50px 58px;">
      <el-form ref="form" :model="form" label-width="270px">
        <el-form-item label="每月提现日：" style="margin-bottom: 28px;">
          <el-input v-model="form.monthKeTiBeginDay" value="" style="width:200px" />
          <span class="p-l-15 p-r-25">号</span>
          <el-input v-model="form.monthKeTiEndDay" value="" style="width:200px" />
          <span class="p-l-15">号</span>
        </el-form-item>

        <el-form-item label="每次可提现金额：" style="margin-bottom: 28px;">
          <el-input v-model="form.keTiMoneyMin" value="" style="width:200px" />
          <span class="p-l-15 p-r-25">元</span>
          <el-input v-model="form.keTiMoneyMax" value="" style="width:200px" />
          <span class="p-l-15">元</span>
        </el-form-item>

        <el-form-item label="提现资格（可提现金额需达到多少钱）：" style="margin-bottom: 28px;">
          <el-input v-model="form.tiXianQualifications" value="" style="width:200px" />
        </el-form-item>

        <el-form-item label="每日提现次数：" style="margin-bottom: 28px;">
          <el-input v-model="form.dayTiXianCount" value="" style="width:200px" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" round class="el-button2" @click="submit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>

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
    query () {
      this.$http.post('/api/TiXian/GetTiXianBaseConfig').then(res => {
        this.form = res.data
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    submit() {
      this.$http.post('/api/TiXian/UpdateTiXianBaseConfig', this.form).then(res => {
        if (res.stateCode === 1) this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  },
  watch: {
  },
  mounted() {
    this.query()
  },
  beforeCreate() {
    document.getElementsByTagName('body')[0].className = `${document.getElementsByTagName('body')[0].className} setting_wrap`
  },
  beforeDestroy() {
    document.body.removeAttribute('class', 'setting_wrap')
  }
}
</script>