<template>
    <el-container class="home-container">
        <!-- 头部试图 -->
        <el-header>
            <div>
                <img src="../assets/logo1.png" alt="">
                <span>电商后台管理后台</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <!-- 左边试图 -->
            <el-aside width="200px">
                <el-menu
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                    <!-- 一级菜单模板区 -->
                    <el-submenu index="1">
                        <!-- 一级菜单模版区域 -->
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>导航一</span>
                        </template>

                        <!-- 二级菜单 -->
                        <el-menu-item>
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>导航一</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右边主视图 -->
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    methods:{
        logout() {
            this.$message.success('退出登录成功')
            window.sessionStorage.clear();
            this.$router.push("/login");
        }
    }
}
</script>

<style lang="less" scoped>

.home-container{
    height: 100%;
}

.el-header{
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 10px;
    color: #fff; //设置文本颜色
    font-size: 20px;
    //嵌套 CSS 布局
    > div {
        display: flex;
        align-items: center;
        img{
            width: 50px;
            height: 50px;
        }
        span {
            margin-left: 15px;
        }
    }
}

.el-aside{
    background-color: #333744;
}

.el-main{
    background-color: #eaedf1;
}
</style>