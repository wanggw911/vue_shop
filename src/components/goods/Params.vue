<template>
    <div>
        <!-- 面包屑 导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片试图 -->
        <el-card class="box-card">
            <!-- 警告区域 -->
            <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
            
            <!-- 选择商品分类区域 -->
            <el-row class="cate_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader v-model="selectedKeys" expand-trigger="hover" :options="categoryList" :props="cascaderProps" @change="cascaderHandleChange" clearable>
                    </el-cascader>
                </el-col>
            </el-row>

            <!-- tabs标签 -->
            <el-tabs v-model="activeName" @tab-click="handleTabsClick">

                <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数的按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
                    
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe> 
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- for循环展示所有的标签 -->
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleTagClose(i, scope.row)">{{item}}</el-tag>
                                <!-- 添加tag的输入框 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                </el-input>
                                 <!-- 添加tag的按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作" width="180px">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParamById(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加属性的按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
                    
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" border stripe> 
                        <!-- 展开行 -->
                        <el-table-column type="expand"></el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作" width="180px">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParamById(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

            </el-tabs>

        </el-card>

        <!-- 添加参数的对话框 -->        
        <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <!-- 内容主体区 -->
            <el-form :model="addParamForm" :rules="addParamRules" ref="addParamFormRef" label-width="70px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addParamForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParamAction">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改参数对话框 -->
        <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <!-- 内容主体区 -->
            <el-form :model="editParamForm" :rules="editParamRules" ref="editParamFormRef" label-width="70px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editParamForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParamAction">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data() {
        return {
            // 商品分类列表数据
            categoryList: [],
            // 级联选择框的配置对象
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
            },
            // 级联选择框的双向绑定的数组
            selectedKeys: [],
            // 被激活的 tabs 页签的名称
            activeName: 'many',
            manyTableData: [],
            onlyTableData: [],

            addDialogVisible: false,
            addParamForm: {
                attr_name: '',
            }, 
            addParamRules: {
                attr_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 6 到 15 个字符', trigger: 'blur' },
                ],
            },
            editDialogVisible: false,
            editParamForm: {
                attr_name: '',
            }, 
            editParamRules: {
                attr_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 6 到 15 个字符', trigger: 'blur' },
                ],
            },
        }
    },
    created() {
        // 获取所有的商品分类列表
        this.getCategoryList()
    },
    // 计算属性，动态控制的参数
    computed: {
        // 如果按钮需要被禁用
        isBtnDisabled() {
            if (this.selectedKeys.length !== 3) {
                return true
            }
            return false
        },
        // 当前选中的三级分类的Id
        cateId() {
            if (this.selectedKeys.length === 3) {
                return this.selectedKeys[2]
            }
            return null
        },
        titleText() {
            if (this.activeName === 'many') {
                return '动态参数'
            }
            return '静态属性'
        },
    },
    methods: {
        // 获取商品分类列表
        async getCategoryList() {
            const {data: res} = await this.$http.get('categories')
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类列表失败！')
            }
            
            console.log(res.data)
            this.categoryList = res.data
        },
        // 级联选择框选中变化的回掉
        cascaderHandleChange() {
            console.log(this.selectedKeys)
            if (this.selectedKeys.length !== 3) {
                this.selectedKeys = []
                this.manyTableData = []
                this.onlyTableData = []
                return
            }
            
            this.getAttributesData()
        },
        handleTabsClick() {
            console.log(this.activeName)

            this.getAttributesData()
        },
        async getAttributesData() {
            // 发起请求，获取数据
            const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: this.activeName}})
            if (res.meta.status !== 200) {
                return this.$message.error('获取列表失败！')
            }
            // 赋值之前，先把字符串分割成数组
            res.data.forEach(element => {
                element.attr_vals = element.attr_vals.split('')

                element.inputVisible = false
                element.inputValue = ''
            })
            console.log(res.data)

            if (this.activeName === 'many') {
                this.manyTableData = res.data
            }
            else {
                this.onlyTableData = res.data
            }
        },
        addDialogClosed() {
            this.$refs.addParamFormRef.resetFields()
        },
        addParamAction() {
            this.$refs.addParamFormRef.validate(async valid => {
                 if(!valid) return 

                 const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`, {
                     attr_name: this.addParamForm.attr_name,
                     attr_sel: this.activeName
                 })
                 if (res.meta.status !== 201) {
                    return this.$message.error('添加参数失败！')
                 }
                 this.$message.success('添加参数成功！')

                 this.addDialogVisible = false
                 this.getAttributesData()
             })
        },
        showEditDialog(params) {
            console.log(params)
            this.editParamForm = params
            this.editDialogVisible = true
        },
        editDialogClosed() {
            this.$refs.editParamFormRef.resetFields()
        },
        editParamAction() {
            this.$refs.editParamFormRef.validate(async valid => {
                 if(!valid) return 

                 const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamForm.attr_id}`, {
                     attr_name: this.editParamForm.attr_name,
                     attr_sel: this.activeName
                 })
                 if (res.meta.status !== 200) {
                    return this.$message.error('修改参数失败！')
                 }
                 this.$message.success('修改参数成功！')

                 this.editDialogVisible = false
                 this.getAttributesData()
             })
        },
        async removeParamById(attr_id) {
            const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(error => error)
            
            console.log(confirmResult)
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }

            //删除用户的网络请求
            const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
            if (res.meta.status !== 200) {
                return this.$message.error('删除参数失败')
            }
            this.$message.success('删除参数成功')
            this.getAttributesData()
        },
        handleInputConfirm(row) {
            if(row.inputValue.trim().length === 0) {
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            //为参数添加标签
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false
            //网络请求添加标签
            this.modifyTag(row)
        },
        showInput(row) {
            row.inputVisible = true
            // 让文本框自动获得焦点
            // nextTick 方法的作用：就是当页面上元素被重新渲染之后，才会执行回调函数中的代码
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            })
        },
        handleTagClose(i, row) {
            //先删除标签，数组删除元素
            row.attr_vals.splice(i, 1)
            //再网络请求修改
            this.modifyTag(row)
        },
        async modifyTag(row) {
            const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                attr_vals: row.attr_vals.join(' '),
            })
            if (res.meta.status !== 200) {
                return this.$message.error('添加标签失败')
            }
            this.$message.success('添加标签成功')
        }
    }
}
</script>

<style lang="less" scoped>
.cate_opt {
    margin: 15px 0;
}
.el-tag {
    margin: 5px;
}
.input-new-tag{
    width: 120px;
}
</style>