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
                    <el-button type="primary">添加分类</el-button>
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
    }
}
</script>

<style lang="less" scoped>
.treeTable {
    margin-top: 15px;
}
</style>