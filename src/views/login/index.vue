<template>
  <div class="login-container">    
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">欢迎登录XXX后台</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          maxlength="18"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          maxlength="32"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="code" class="code">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          ref="code"
          maxlength="6"
          v-model="loginForm.code"
          type="text"
          placeholder="图形码"
          name="code"
          tabindex="3"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
        <span class="auth_code" @click="getAuthCode()" v-if="authCode != ''">
          <img :src="authCode" style="width:150%;height:150%;border-radius: 5px;margin-left: 10%;">
        </span>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { getAuthCode,login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码太短'))
      } else {
        callback()
      }
    }
    const validateCode = (rule,value,callback) =>{
      if(value == ''){
        callback(new Error('请输入验证码'))
      }else{
        callback()
      }
    }
    return {
      authCode: '',
      loginForm: {
        username: 'admin',
        password: '123456',
        code:'',
        key:''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        code: [{ required: true, trigger: 'blur', validator: validateCode}]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
   created() {
    this.getAuthCode()
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    getAuthCode(){
     getAuthCode().then(response => {
        this.authCode = response.data.pic
        this.loginForm.key = response.data.picKey
      })

    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
          if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
            this.getAuthCode()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#606266;
$cursor: #606266;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    width: 85%;
    input {
       background: transparent;
      border: 0px;
       -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
       color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color:  $bg !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #dcdfe6;
    background: #fff;
    border-radius: 5px;
    color: #454545;
  }
  .el-form-item:not(.nohover):hover{
        border: 1px solid #3a8ee6;
  }
  .code{
    width: 70%;
    float: left;
  }
  .auth_code{
    float: left;
    // height: 47px;
  }
}
</style>

<style lang="scss" scoped>
$bg:#3a8ee6;
$dark_gray:#889aa4;
$light_gray:rgba(0,0,0,.85);

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px;
    margin: 10% auto 0;
    overflow: hidden;
    background-color:  #fff;
  }

  .tips {
    // font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
