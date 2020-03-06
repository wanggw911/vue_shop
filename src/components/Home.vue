<template>
    <div class="home_container">
        <el-button type="info" @click="logout">退出</el-button>
    </div>
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
</style>