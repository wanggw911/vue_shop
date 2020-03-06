<template>
    <div>
        <!-- 面包屑 导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card class="box-card">
           
            <!-- 搜索与添加按钮区域 -->
            <el-row :gutter="20"> 
                <!-- gutter 设置每个格子之间的间距 -->
                <!-- 使用列布局，来避免整个输入框占满一行 -->
                <el-col :span="10">
                    <el-input placeholder="请输入内容" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 --> 
            <el-table :data="userList" border stripe> 
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="phone"></el-table-column>
                <el-table-column label="角色" prop="role"></el-table-column>
                <el-table-column label="状态" prop="state"></el-table-column>
                <el-table-column label="操作" prop="action"></el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pageSize: 2,
            },
            userList: [],
            total: 0,
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        async getUserList() {
            // const {data: res} = await this.$http.get('users', {
            //    params: this.queryInfo
            // })
            // if(res.meta.status !== 200) {
            //     return this.$message.error('获取用户列表失败')
            // }
            // this.userList = res.data.users
            // this.total = res.data.total
            // console.log(res)

            // 模拟用户    
            this.userList = [
                {
                    'username': '张三',
                    'email': '12321@qq.com',
                    'phone': '18500001111',
                    'role': '学生',
                    'state': true,
                },
                {
                    'username': '李四',
                    'email': '12321@qq.com',
                    'phone': '18500001111',
                    'role': '老师',
                    'state': false,
                },
                {
                    'username': '王武',
                    'email': '12321@qq.com',
                    'phone': '18500001111',
                    'role': '管理员',
                    'state': true,
                },
            ]
        }
    }
}
</script>

<style lang="less" scoped>
</style>