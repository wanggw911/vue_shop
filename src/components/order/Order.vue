<template>
    <div>
        <!-- 面包屑 导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        
        <!-- 卡片试图区域 -->
        <el-card class="box-card">
           
            <!-- 搜索与添加按钮区域 -->
            <el-row :gutter="20"> 
                <!-- gutter 设置每个格子之间的间距 -->
                <!-- 使用列布局，来避免整个输入框占满一行 -->
                <!-- 搜索控件，清空按钮，会触发 clear 绑定的方法 -->
                <el-col :span="10">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
                        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddGoodsPage()">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 --> 
            <el-table :data="orderList" border stripe> 
                <!-- 设置表格的索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="订单编号" prop="order_id"></el-table-column>
                <el-table-column label="订单价格" prop="order_price" width="95px"></el-table-column>
                <el-table-column label="是否付款" width="70px">
                    <template slot-scope="scope">
                        <el-tag size="mini" type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                        <el-tag size="mini" type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" width="70px">
                    <template slot-scope="scope">
                        {{scope.row.is_send}}
                    </template>
                </el-table-column>
                <el-table-column label="下单时间" width="140px">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}
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
            // 订单列表数据
            orderList: [],
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 3,
            },
            total: 0,
        }
    },
    created() {
        // 获取订单列表数据
        this.getOrderList()
    },
    methods: {
        // 获取订单列表数据
        async getOrderList() {
            const {data: res} = await this.$http.get('orders', {params: this.queryInfo})
            if (res.meta.status !== 200) {
                return this.$message.error('获取订单列表失败！'+res.meta.msg)
            }
            
            this.orderList = res.data.goods
            this.total = res.data.total
            console.log('获取订单列表成功！')
            console.log(res.data)
        },
        // 监听 pagessize 改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        // 监听页码值发生改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getOrderList()
        },
    }
}
</script>

<style lang="less" scoped>
// .el-tag{
//     margin-right: 5px;
// }

</style>