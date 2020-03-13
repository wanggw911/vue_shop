<template>
    <div>
        <!-- 面包屑 导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片试图区 -->
        <el-card class="box-card">
            <!-- 警告信息 -->
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
            </el-alert>
            
            <!-- 步骤条区域 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品照片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!-- 左侧Tab栏区域 -->
            <!-- 只允许 form 嵌套 tabs，不允许 tabs 嵌套 form -->
            <el-form :model="addGoodsForm" :rules="addGoodsRules" ref="ruleForm" label-width="100px" label-position="top">
                <!-- style="height: 200px;" -->
                <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeLeave">

                    <el-tab-pane label="基本信息" name="0">    
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addGoodsForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price" type="number">
                            <el-input v-model="addGoodsForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight" type="number">
                            <el-input v-model="addGoodsForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number" type="number">
                            <el-input v-model="addGoodsForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_number" type="number">
                            <!-- 选择商品分类的级联选择框 -->
                            <el-cascader v-model="addGoodsForm.goods_cat" expand-trigger="hover" :options="categoryList" :props="cascaderProps" @change="cascaderHandleChange" clearable>
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
                    <el-tab-pane label="商品照片" name="3">商品照片</el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeIndex: '0',
            addGoodsForm: {
                goods_name: '',
                goods_price: 0, 
                goods_weight: 0, 
                goods_number: 0,
                goods_cat: 0, //商品所属的分类，级联选择框的双向绑定的数组
            },
            addGoodsRules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 6 到 15 个字符', trigger: 'blur' },
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' },
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' },
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' },
                ],
                goods_cat: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' },
                ],
            },
            categoryList: [],
            // 级联选择框的配置对象
            cascaderProps: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children',
            }, 
        }
    },
    created() {
       this.getGoodsCateList()
    },
    methods: {
        // 获取所有商品的数据
        async getGoodsCateList() {
            const {data: res} = await this.$http.get('categories')
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类失败！')
            }
            console.log('获取商品分类成功！')

            console.log(res.data)
            this.categoryList = res.data
        },
        // 级联选择框选中变化的回掉
        cascaderHandleChange() {
            console.log(this.selectedKeys)
            if (this.addGoodsForm.goods_cat.length !== 3) {
                this.addGoodsForm.goods_cat = []
                return
            }
        },
        // tabs 标签页的切换控制
        beforeLeave(activeName, oldActiveName) {
            if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
                this.$message.error('请先选择商品分类！')
                return false
            }
        },
    }
}
</script>

<style lang="less" scoped>
</style>