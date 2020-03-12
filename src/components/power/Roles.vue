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
                        <el-row :class="['vcenter', 'bdbottom', i1 === 0 ? 'bdtop' : '']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限，总共分为24列，前面5列，后面19列 -->
                            <el-col :span="5">
                                <el-tag  closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                                <!-- 小箭头组件 -->
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过 for 循环 嵌套渲染二级权限 -->
                                <el-row :class="['vcenter', i2 === 0? '' :'bdtop']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <!-- 渲染出三级结构 -->
                                        <el-tag v-for="(item3) in item2.children" :key="item3.id" type="warning" closable @close="removeRightById(scope.row, item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>    
                            </el-col>
                        </el-row>
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
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightsDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>    
        </el-card>

        <!-- 分配权限的对话框 -->
        <el-dialog title="分配权限" :visible.sync="setRightsDialogVisible" width="50%" @close="setRightDailogClosed">
            <!-- 树形控件 -->
            <!-- :data 数据源 -->
            <!-- :props 数据绑定的映射-->
            <!-- show-checkbox 显示复选框 -->
            <!-- node-key 每一项绑定的唯一id -->
            <!-- default-expand-all 是否默认展开全部 -->
            <el-tree :data="rightsList" :props="treeProps" ref="treeRef" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRightAction">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 所有角色列表数据
            rolesList: [],
            setRightsDialogVisible: false,
            //所有权限的数据
            rightsList: [],
            //树形控件的树形绑定对象
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            //默认选中的元素列表
            defKeys: [],
            //分配权限时的id
            roleId: '',
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
        // 根据id删除对应的权限
        async removeRightById(role, rightId) {
            //弹框提示用户是否需要删除
            const confirmResult = await this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(error => error)
            
            console.log(confirmResult)
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            console.log('确认了删除')

            //删除用户的网络请求
            const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if (res.meta.status !== 200) {
                console.log('删除标签失败')
                return this.$message.error('删除标签失败')
            }
            console.log('删除标签成功')
            this.$message.success('删除标签成功')

            //重新加载数据会导致，页面渲染
            //this.getRolesList()
            //直接设置数据，局部刷新
            role.children = res.data
        },
        // 展示权限分配的对话框
        async showSetRightsDialog(role) {
            const {data: res} = await this.$http.get('rights/tree')
            if (res.meta.status !== 200) {
                console.log('获取权限数据失败')
                return this.$message.error('获取权限数据失败')
            }
            console.log('获取权限数据成功')

            this.rightsList = res.data
            this.roleId = role.id

            //递归获取
            this.getLeadfKeys(role, this.defKeys)
            console.log(this.defKeys)

            //获取所有权限的数据
            this.setRightsDialogVisible = true
        },
        // 通过递归的方式，获取角色下所有三级权限的id, 并保存到 defKeys 中
        getLeadfKeys(node, arr) {
            if (!node.children) {
                return arr.push(node.id)
            }

            node.children.forEach(element => this.getLeadfKeys(element, arr));
        },
        // 设置权限的操作
        async setRightAction() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys(),
            ]
            console.log(keys)

            const idStr = keys.join(',')
            const {data: res} = await this.$http.get(`roles/${this.roleId}/rights`, {rids: idStr})
            if (res.meta.status !== 200) {
                console.log('分配权限失败')
                return this.$message.error('分配权限失败')
            }
            console.log('分配权限成功')

            this.getRolesList()
            this.setRightsDialogVisible = false
        },
        setRightDailogClosed() {
            this.defKeys = []
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

.vcenter {
    display: flex;
    align-items: center;
}

</style>