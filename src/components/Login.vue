<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登陆表单区域 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form" label-width="0px">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            // 登陆表单数据
            loginForm: {
                username: 'admin',
                password: '123456',
            },
            // 登陆表单验证规则
            loginFormRules: {
                username: [
                    { required: true, message: '请输入登录账号', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            },
        }
    },
    methods: {
        login() {
            this.$refs.loginFormRef.validate(async valid => {
                console.log(valid);
                if (!valid) return;
            
                // 异步请求方法，需要设置 await, 同时设置 async
                // 使用 data 来解构返回的参数
                const {data: res} = await this.$http.post('login', this.loginForm);
                console.log(res);
                if (res.meta.status !== 200) console.log("登陆失败");
                console.log("登陆成功");
                window.sessionStorage.setItem("token", res.data.token)
                this.$router.push("/home")

                /*
                登录成功之后的操作
                1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
                    1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
                    1.2 token 只应在当前网站打开期间生效，所以 token 保存在 sessionStorage 中
                2. 通过编程式导航跳转到后台主页，路由地址是 /home
                */

                // 模拟登录
                // if (this.loginForm.username == 'admin' && this.loginForm.password == '123456') {                
                //     this.$message.success('登录成功')
                //     window.sessionStorage.setItem("token", "123456")
                //     this.$router.push("/home")
                // }
                // else {
                //     this.$message.error('登录失败')
                // }
            });
        },
        // 点击重置按钮，
        resetLoginForm() {
            console.log(this)
            // loginFormRef 表单的引用对象
            this.$refs.loginFormRef.resetFields();
        }
    }
} 
</script>

<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;   
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .avatar_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}

.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

.btns{
    display: flex;
    justify-content: flex-end;
}

</style>