<template>
    <el-container class="home-container">
        <!-- 头部试图 -->
        <el-header>
            Header
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <!-- 左边试图 -->
            <el-aside width="200px">Aside</el-aside>
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
}

.el-aside{
    background-color: #333744;
}

.el-main{
    background-color: #eaedf1;
}
</style>