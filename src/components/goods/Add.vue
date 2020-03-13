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
                <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeLeave" @tab-click="tabClick">

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

                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="cb" v-for="(cb, i) in item.attr_vals" :key="i"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品照片" name="3">
                        <el-upload class="upload-demo" :action="uploadURL" :headers="headerObj" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>

                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器组件 -->
                        <quill-editor v-model="addGoodsForm.goods_introduce">
                        </quill-editor>
                        <!-- 添加商品的按钮 -->
                        <el-button type="primary" class="btnAdd" @click="addGoodsAction">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <!-- 预览图片的对话框 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%" @close="previewDialogClosed">
            <img class="previewImg" :src="previewPath" alt="">
        </el-dialog>

    </div>
</template>

<script>
import _ from 'lodash'

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
                //图片数组
                pics: [],
                //商品介绍
                goods_introduce: '',
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
            manyTableData: [],
            onlyTableData: [],
            //上传图片的地址
            uploadURL: 'https://www.liulongbin.top:8888/api/private/v1/upload',
            //上传图片的请求头
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            //预览图片的URL
            previewPath: '',
            previewVisible: false,
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
            // if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
            //     this.$message.error('请先选择商品分类！')
            //     return false
            // }
        },
        tabClick() {
            if(this.activeIndex === '1') { 
                this.getAttributesData()
            }
            else if(this.activeIndex === '2') { 
                this.getAttributesData()
            }
        },
        async getAttributesData() {
            const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: this.sel}})
            if (res.meta.status !== 200) {
                return this.$message.error('获取列表失败！')
            }
            // 赋值之前，先把字符串分割成数组
            res.data.forEach(element => {
                element.attr_vals = element.attr_vals.split('')
            })
            console.log(res.data)

            if (this.sel === 'many') {
                this.manyTableData = res.data
            }
            else {
                this.onlyTableData = res.data
            }
        },
        handlePreview(file) {
            console.log(file)
            this.previewPath = file.response.data.url
            this.previewVisible = true
        },
        previewDialogClosed() {
            this.previewVisible = false
        },
        handleRemove(file) {
            console.log(file) //file 就是上传接口返回的信息
            //1、获取图片的临时路径
            const filePath = file.response.data.tmp_path
            //2、从 pics 数组中，找到图片对应的索引值
            const index = this.addGoodsForm.pics.findIndex(x => {
                x.pic === filePath
            })
            //3、调用数组 splice 方法，把图片对象移除
            this.addGoodsForm.pics.splice(i, 1)
            console.log(this.addGoodsForm)
        },
        //监听图片上传成功的回掉
        handleSuccess(response) {
            // 拼接获取一个图片对象
            const picInfo = { pic: response.data.tmp_path}
            // 将图片对象 push 到 pics 数组中
            this.addGoodsForm.pics.push(picInfo)
            console.log(this.addGoodsForm)
        },
        addGoodsAction() {
            console.log(this.addGoodsForm)
            //先进行表单数据校验
            this.$refs.addParamFormRef.validate(async valid => {
                //深拷贝表单form，避免对原数据造成影响
                const form = _.cloneDeep(this.addGoodsForm)
                form.goods_cat = form.goods.cat.jion(',')
                //处理动态参数
                this.manyTableData.forEach(item => {
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals.jion(' ')
                    }
                    this.addGoodsForm.attrs.push(newInfo)
                })
                //处理静态参数
                this.onlyTableData.forEach(item => {
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals.jion(' ')
                    }
                    this.addGoodsForm.attrs.push(newInfo)
                })
                form.attrs = this.addGoodsForm.attrs
                //发起请求添加商品
                const {data: res} = await this.$http.post('goods', form)
                if (res.meta.status !== 201) {
                    return this.$message.error('添加商品失败！')
                }
                this.$message.success('添加商品成功！')
                //路由跳转
                this.$router.push('/goods')
            })
        },
    },
    computed: {
        cateId() {
            if(this.addGoodsForm.goods_cat.length === 3) {
                return this.addGoodsForm.goods_cat[2]
            }
            return null
        },
        sel() {
            if (this.activeIndex === '1') { 
                return 'many'
            }
            else if (this.activeIndex === '2') { 
                return 'only'
            }
            return null
        }
    }
}
</script>

<style lang="less" scoped>

.el-checkbox {
    margin-right: 5px;
}

.previewImg{
    width: 100%;
}

.btnAdd {
    margin-top: 10px;
}

</style>