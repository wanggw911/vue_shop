<template>
    <div>
        <!-- 面包屑 导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片试图 -->
        <el-card class="box-card">

            <!-- 添加分类按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格列表数据区域 -->
            <tree-table class="treeTable" :data="categoryList" :columns="columns" show-index index-text="#" border :selection-type="false" :expand-type="false">
                <!-- 自定义列 -->
                <template slot="isOK" slot-scope="scope">
                    <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color: lightgreen"></i>
                    <i v-if="scope.row.cat_deleted === true" class="el-icon-error" style="color: red"></i>
                </template>
                <!-- 自定义列 -->
                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
                    <el-tag v-if="scope.row.cat_level === 1" size="mini" type="success">二级</el-tag>
                    <el-tag v-if="scope.row.cat_level === 2" size="mini" type="warning">一级</el-tag>
                </template>
                <!-- 自定义列 -->
                <template slot="operation" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditUserInfoDialog(scope.row)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row)">删除</el-button>
                </template>
            </tree-table>
            <!-- <el-table :data="categoryList" border stripe> 
                <el-table-column type="index"></el-table-column>
                <el-table-column label="分类名称" prop="cat_name"></el-table-column>
                <el-table-column label="是否有效" prop="path"></el-table-column>
                <el-table-column label="排序">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.cat_level === '0'">一级</el-tag>
                        <el-tag v-if="scope.row.cat_level === '1'" type="success">二级</el-tag>
                        <el-tag v-if="scope.row.cat_level === '2'" type="warning">一级</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditUserInfoDialog(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>     -->

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                :page-sizes="[5, 10]"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>

        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
            <!-- 内容主体区 -->
            <el-form :model="addCateForm" :rules="addCateRules" ref="addCateFormRef" label-width="70px">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
                    <!-- options 指定数据源 -->
                    <!-- props 指定配置对象 -->
                    <!-- clearable 是否显示清空按钮 -->
                    <!-- change-on-select 控制是否能选中一级 -->
                    <el-cascader
                        v-model="cascaderSelectedKeys"
                        expand-trigger="hover"
                        :options="parentCateList"
                        :props="cascaderProps"
                        @change="cascaderHandleChange"
                        clearable
                        change-on-select></el-cascader>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCateAction">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data() {
        return {
            // 请求参数
            queryInfo: {
                type: [3],
                pagenum: 1,
                pagesize: 5,
            },
            // 所有的数据
            total: 0,
            // 商品分类列表数据，默认为空
            categoryList: [],
            // 为 table 指定列的信息
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    type: 'template', // 表示将当前列定义为模板                    
                    template: 'isOK', // 表示当前这一列使用模板名称
                },
                {
                    label: '排序',
                    type: 'template', // 表示将当前列定义为模板                    
                    template: 'order', // 表示当前这一列使用模板名称
                },
                {
                    label: '操作',
                    type: 'template', // 表示将当前列定义为模板                    
                    template: 'operation', // 表示当前这一列使用模板名称
                },
            ],
            // 控制添加分类的对话框是否显示
            addCateDialogVisible: false,
            addCateForm: {
                cat_name: '',
                cat_pid: 0, //父级分类
                cat_level: 0, //默认添加的分类是一级分类
            },
            addCateRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 6 到 15 个字符', trigger: 'blur' },
                ],
            },
            parentCateList: [],
            //
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
            },
            // 级连选择器选中的对象，是一个数组
            cascaderSelectedKeys: []
        }
    },
    created() {
        // 获取所有的商品分类数据
        this.getCategoryList()
    },
    methods: {
        // 获取商品分类数据
        async getCategoryList() {
            const {data: res} = await this.$http.get('categories', {params: this.queryInfo})
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类失败！')
            }
            console.log('获取商品分类成功！')

            console.log(res.data)
            this.categoryList = res.data.result
            this.total = res.data.total
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getCategoryList()
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getCategoryList()
        },
        async showAddCateDialog() {
            this.getParentCateList()

            this.addCateDialogVisible = true
        },
        async getParentCateList() {
            const {data: res} = await this.$http.get('categories', {params: {type: 2}})
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类失败！')
            }
            console.log('获取商品分类成功！')
            this.parentCateList = res.data
        },
        addCateAction () {
             this.$refs.addCateFormRef.validate(async valid => {
                 if(!valid) return 

                 const {data: res} = await this.$http.post('categories', this.addCateForm)
                 if (res.meta.status !== 201) {
                    return this.$message.error('添加商品分类失败！')
                 }
                 this.$message.success('添加商品分类成功！')

                 this.getCategoryList()
                 this.addCateDialogVisible = false
             })
        },
        addCateDialogClosed() {
            //重置表单数据
            this.$refs.addCateFormRef.resetFields()

            this.cascaderSelectedKeys = []
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0
        },
        cascaderHandleChange() {
            console.log(this.cascaderSelectedKeys)
            // 如果 cascaderSelectedKeys length 大于 0 ，否则就没选择
            if (this.cascaderSelectedKeys.length > 0) {
                // 父类的ID：每次都取数组中的最后一项
                this.addCateForm.cat_pid = this.cascaderSelectedKeys[this.cascaderSelectedKeys.length - 1]
                // 当前的等级
                this.addCateForm.cat_level = this.cascaderSelectedKeys.length
            }
            else {
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        },
    }
}
</script>

<style lang="less" scoped>
.treeTable {
    margin-top: 15px;
}
.el-cascader{
    width: 100%;
}
</style>