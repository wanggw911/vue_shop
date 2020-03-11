<template>
    <div>
        <!-- 面包屑 导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片试图 -->
        <el-card class="box-card">
            <!-- border 为表格设置分割线 -->
            <!-- stripe 隔行变色的功能 -->
            <el-table :data="rightsList" border stripe> 
                <!-- 设置表格的索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <!-- 作用域插槽的形式来自定义表格里面的内容 -->
                    <template slot-scope="scope">
                        <!-- v-if 来判断显示那个 -->
                        <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                        <el-tag v-if="scope.row.level === '1'" type="success">二级</el-tag>
                        <el-tag v-if="scope.row.level === '2'" type="warning">一级</el-tag>
                    </template>
                </el-table-column>
            </el-table>    
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 权限列表数据
            rightsList: []
        }
    },
    created() {
        // 获取所有的权限
        this.getRightsList()
    },
    methods: {
        // 获取权限列表
        async getRightsList() {
            const {data: res} = await this.$http.get('rights/list')
            if (res.meta.status !== 200) {
                return this.$message.error('获取权限列表失败！')
            }
            
            this.rightsList = res.data
            console.log('获取权限列表成功！')
            console.log(res.data)
        },
    }
}
</script>

<style lang="less" scoped>
</style>