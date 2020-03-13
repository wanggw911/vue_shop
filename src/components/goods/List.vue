<template>
    <div>
        <!-- 面包屑 导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
           
            <!-- 搜索与添加按钮区域 -->
            <el-row :gutter="20"> 
                <!-- gutter 设置每个格子之间的间距 -->
                <!-- 使用列布局，来避免整个输入框占满一行 -->
                <!-- 搜索控件，清空按钮，会触发 clear 绑定的方法 -->
                <el-col :span="10">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddGoodsPage()">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 --> 
            <el-table :data="goodsList" border stripe> 
                <!-- 设置表格的索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
                <el-table-column label="商品数量" prop="goods_number" width="70px"></el-table-column>
                <el-table-column label="创建时间" width="140px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditGoodsInfoDialog(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoodsById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                :page-sizes="[5, 10, 20, 30]"
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
            // 商品列表数据
            goodsList: [],
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5,
            },
            total: 0,
            addDialogVisible: false,
        }
    },
    created() {
        // 获取商品列表
        this.getGoodsList()
    },
    methods: {
        // 获取商品列表
        async getGoodsList() {
            const {data: res} = await this.$http.get('goods', {
               params: this.queryInfo
            })
            console.log(res)
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品列表失败！'+res.meta.msg)
            }
            
            this.goodsList = res.data.goods
            this.total = res.data.total
            console.log('获取商品列表成功！')
        },
        // 监听 pagessize 改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        // 监听页码值发生改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        showEditGoodsInfoDialog(goods) {
        },
        // 删除商品
        async removeGoodsById(goodsId) {
            const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(error => error)
            
            console.log(confirmResult)
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }

            //删除用户的网络请求
            const {data: res} = await this.$http.delete('goods/' + goodsId)
            if (res.meta.status !== 200) {
                return this.$message.error('删除商品失败')
            }
            this.$message.success('删除商品成功')
            this.getGoodsList()
        },
    }
}
</script>

<style lang="less" scoped>
</style>