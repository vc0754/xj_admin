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
          <el-input v-model="form.monthKeTiBeginDay" value="" style="width:200px" @input="inputChange('monthKeTiBeginDay')" />
          <span class="p-l-15 p-r-25">号</span>
          <el-input v-model="form.monthKeTiEndDay" value="" style="width:200px" @input="inputChange('monthKeTiEndDay')" />
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
          <el-input v-model="form.dayTiXianCount" value="" style="width:200px" @input="inputChange('dayTiXianCount')" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" round class="el-button2" @click="submit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>

  </section>
</template>

<script>
import { mapActions } from 'vuex'
import { USER_SIGNOUT } from '@/store/modules/user'
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
    ...mapActions([ USER_SIGNOUT ]),
    inputChange(prop) {
      this.form[prop] = this.form[prop].replace(/[^\d]/g, '')
      this.form[prop] = this.form[prop].substring(0, 2) * 1
    },
    query () {
      this.$http.post('/api/TiXian/GetTiXianBaseConfig').then(res => {
        this.form = res.data
      }).catch(err => {
        this.$message.error(err.message)
        if (err.data.message === '身份验证失败') {
          this.USER_SIGNOUT()
          this.$router.replace({ path: '/sign' })
        }
      })
    },
    submit() {
      // if (this.form.monthKeTiBeginDay) this.$message.error('格式不正确')
      // if (this.form.monthKeTiEndDay) this.$message.error('格式不正确')

      this.$http.post('/api/TiXian/UpdateTiXianBaseConfig', this.form).then(res => {
        if (res.stateCode === 1) this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
        if (err.data.message === '身份验证失败') {
          this.USER_SIGNOUT()
          this.$router.replace({ path: '/sign' })
        }
      })
    }
  },
  watch: {
  },
  mounted() {
    this.query()
  }
}
</script>