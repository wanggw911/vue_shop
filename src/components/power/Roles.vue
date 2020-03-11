<template>
    <div>
        <!-- 面包屑 导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片试图 -->
        <el-card class="box-card">
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区域 -->
            <el-table :data="rolesList" border stripe> 
                <!-- 展开列 （scope 范围视角）-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- 使用列布局来渲染展开的后的试图 -->
                        <!-- 使用 for 循环来渲染多行数据 -->
                        <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限，总共分为24列，前面5列，后面19列 -->
                            <el-col :span="5">
                                <el-tag>{{item1.authName}}</el-tag>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19"></el-col>
                        </el-row>

                        <pre>
                            {{scope.row}}
                        </pre>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <!-- width="300px"  给列设置宽度，可以让内容显示完全 -->
                <el-table-column label="操作" width="300px">
                    <!-- 作用域插槽的形式来自定义表格里面的内容 -->
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditUserInfoDialog(scope.row.id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="removeUserById(scope.row.id)">分配权限</el-button>
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
            // 所有角色列表数据
            rolesList: []
        }
    },
    created() {
        // 获取所有的权限
        this.getRolesList()
    },
    methods: {
        // 获取权限列表
        async getRolesList() {
            const {data: res} = await this.$http.get('roles')
            if (res.meta.status !== 200) {
                return this.$message.error('获取角色列表失败！')
            }
            
            this.rolesList = res.data
            console.log('获取角色列表成功！')
            console.log(res.data)
        },
    }
}
</script>

<style lang="less" scoped>

.el-tag{
    margin: 7px;
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

</style>