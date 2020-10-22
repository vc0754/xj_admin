<template>
  <div class="login-wrapper" :style="{ backgroundImage: `url(${require('../../assets/bg.png')})`}">
    <div class="login-container">

      <div class="sign-page" :style="{ backgroundImage: `url(${require('../../assets/login.png')})`}">
        <h1>忘记密码</h1>
        <el-form class="sign-content" ref="formPSW" :model="formPSW">
          <el-form-item prop="mobile">
            <el-input v-model="formPSW.mobile" placeholder="请输入手机号" />
            <div class="getSMS">
              <span v-if="count">{{ count }}s</span>
              <span class="send" @click="getSMS" v-else>获取验证码</span>
            </div>
          </el-form-item>
          
          <el-form-item prop="code">
            <el-input v-model="formPSW.code" placeholder="请输入验证码" :maxlength="6" />
          </el-form-item>

          <el-form-item prop="login_pwd">
            <el-input type="password" v-model="formPSW.login_pwd" placeholder="设置新密码" :maxlength="6" />
          </el-form-item>

          <el-form-item prop="login_pwd2">
            <el-input type="password" v-model="formPSW.login_pwd2" placeholder="确认新密码" :maxlength="6" />
          </el-form-item>
        </el-form>

        <div class="sign-button">
          <el-button type="primary" round :loading="loading" @click="handleSubmit">重置密码</el-button>
        </div>
        
        <div class="sign-meta">
          <div class="flex flex-x-between">
            <span>已有账号</span>
            <router-link to="/sign">立即登录</router-link>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'LostPasswordView',
  data () {
    return {
      formPSW: {
        mobile: '',
        code: '',
        login_pwd: '',
        login_pwd2: '',
      },
      loading: false,
      timeID: 0,
      count: 0
    }
  },
  methods: {
    getSMS() {
      if (!this.formPSW.mobile) return this.$message.error('手机号码必须')
      this.$http.post('/api/UserInfo/SendSms', {
        mobile: this.formPSW.mobile
      }).then(res => {
        this.count = 30
        this.timeID = setInterval(() => {
          --this.count
          if (this.count <= 0) clearInterval(this.timeID)
        }, 1000)
        console.log(res)
      }).catch(err => {
        this.$message.error(err.data.message)
      })
    },
    // 提交表单
    handleSubmit () {
      if (!this.formPSW.mobile) return this.$message.error('手机号码必须')
      if (!this.formPSW.code) return this.$message.error('验证码必须')
      if (!this.formPSW.login_pwd) return this.$message.error('密码必须')
      if (!this.formPSW.login_pwd2) return this.$message.error('确认新密码')
      if (this.formPSW.login_pwd2 !== this.formPSW.login_pwd2) return this.$message.error('两次密码不一致')
      
      this.$http.post('/api/UserInfo/UpdatePwd', this.formPSW).then(res => {
        console.log(res)
        this.$message.success('修改成功')
      }).catch(err => {
        this.$message.error(err.data.message)
      })
    },
  },
  watch: {
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
.login-wrapper {
  background-color: #222; background-position: center center; background-repeat: no-repeat; background-size: cover;
  width: 100%; height: 100%;
  position: absolute;
}
.login-container {
  position: absolute; left: 50%; top: 50%;
  transform: translate3d(-50%, -50%, 0);
}

.sign-page {
  background-color: #fff; background-repeat: no-repeat;
  width: 850px; height: 530px;
  border-radius: 8px;
  box-shadow: 0px 8px 30px 0px rgba(173, 43, 81, 0.44);
  padding: 40px 40px 40px 490px;
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  
  h1 {
    font-size: 16px;
    font-family: 'MicrosoftYaHei';
    color: rgba(0, 0, 0, 0.85);
    -webkit-text-stroke: 1px rgba(0, 0, 0, 0.85);
    margin-bottom: 32px;
    align-self: flex-start;
  }

  .sign-content {
    width: 100%;
    margin-bottom: 18px;
  }

  .sign-button {
    width: 100%; margin-bottom: 28px;
    button {
      background: #EC4B4B;
      box-shadow: 0px 5px 10px 0px rgba(254, 91, 91, 0.46);
      width: 100%;
      border-color: #EC4B4B;
    }
  }

  .sign-meta {
    color: rgba(0, 0, 0, 0.65);
    font-size: 12px;
    width: 100%;
    a {
      color: #EC4B4B;
    }
  }

  .getSMS {
    span.send {
      color: #EC4B4B;
      cursor: pointer;
    }
    position: absolute; right: 20px; top: 0px;
  }
}
</style>
