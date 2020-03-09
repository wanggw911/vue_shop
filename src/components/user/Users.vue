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
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 --> 
            <el-table :data="userList" border stripe> 
                <!-- 设置表格的索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <!-- 使用了下面的作用域插槽，就可以不写了 prop 了 prop="state"-->
                    <template slot-scope="scope">
                        <!-- active-color="#13ce66" inactive-color="#ff4949" -->
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template>
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                :page-sizes="[1, 3, 5]"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-size="queryInfo.pageSize"  
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
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
                pagesize: 3,
            },
            userList: [],
            total: 0,
        }
    },
    created() {
        this.getUserList(1)
    },
    methods: {
        async getUserList(page) {
            const {data: res} = await this.$http.get('users', {
               params: this.queryInfo
            })
            if(res.meta.status !== 200) {
                return this.$message.error('获取用户列表失败')
            }
            this.userList = res.data.users
            this.total = res.data.total
            console.log(res)
        },
        // 监听 pagessize 改变的事件
        handleSizeChange(newSize) {
            //console.log(newSize)
            this.queryInfo.pagesize = newSize
            this.getUserList(newSize)
        },
        // 监听页码值发生改变的事件
        handleCurrentChange(newPage) {
            //console.log(newPage)
            //翻页请求
            this.queryInfo.pagenum = newPage
            this.getUserList(1)
        },
        async userStateChanged(userInfo) {
            console.log('userInfo'+userInfo)
            const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
            if (res.meta.status !== 200) {
                userInfo.mg_state = !userInfo.mg_state
                return this.$message.error('更新用户状态失败')
            }
            this.$message.success('更新用户状态成功')
        },
    }
}
</script>

<style lang="less" scoped>
</style>