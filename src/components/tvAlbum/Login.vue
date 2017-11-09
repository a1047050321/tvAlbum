<template>
<div>
  <div class="picture">
    <img src="" alt="">图片
  </div>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <el-form-item prop="account">
      <span>登录名</span><el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <span>登陆密码</span><el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住我的登录状态</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="margin-left:75%;width:70px;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
  </div>
</template>

<script>
//   import { requestLogin } from '../api/api';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: 'admin',
          checkPass: '123456'
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2() {
        //登录验证
        var self = this;
      var url = this.$iHomed("api","monitor_channel");
      sessionStorage.setItem('accesstoken', "access_token");
      console.log(this.$iHomed("config","userid"));
      var userid = this.$iHomed("config","userid");
      // console.log(this.$iHomed.setCookie("userid",userid));
      self.$notify({ title: '成功', message: '登陆成功', type: 'success' });
      self.$router.push({path: '/home', replace: true});      
          // data = this.loginData;
    //     this.$http({
    //       url:url,
    //       type:"post",
    //       data:data
    //     }).then((response) => {
    //       sessionStorage.setItem('accessToken', "access_token");
    //       sessionStorage.setItem('userName', "username");
    //       self.$notify({ title: '成功', message: '登陆成功', type: 'success' });
    //     self.$router.push({path: '/home', replace: true});      
    // }).catch((err) => {
    //           sessionStorage.setItem('accessToken', "access_token");
    //           this.$notify({ title: '失败', message: '登陆失败', type: 'warn' });
    //     console.log(err);
    // })
  }
    }
  }

</script>

<style scoped>
.picture{
    position:fixed;
    top:180px;
    left:300px;
  width:300px;
  height:245px;
  background:#20A0ff;
  color:#fff;
}
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    position:fixed;
    top:180px;
    left:600px;
    border-radius: 5px;
    background-clip: padding-box;
    width: 500px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
  .el-input{
    display:inline-block;
    width:70%;
    margin-left:20px;
  }
  span{
      display:inline-block;
      width:70px;
  }
</style>