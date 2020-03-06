<template>
    <el-container class="home-container">
        <!-- 头部试图 -->
        <el-header>
            <div>
                <img src="../assets/logo1.png" alt="">
                <span>电商后台管理后台</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <!-- 左边试图 -->
            <el-aside width="200px">
                <el-menu
                    :unique-opened="true"
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#409EFF">
                    <!-- 一级菜单模板区 -->
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单模版区域 -->
                        <template slot="title">
                            <i :class="iconsObject[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="subItem.id + ''" v-for="subItem in item.children" :key="subItem.id">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右边主视图 -->
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            menuList: [],
            iconsObject: {
                '1': 'iconfont icon-user',
                '2': 'iconfont icon-tijikongjian',
                '3': 'iconfont icon-shangpin',
                '4': 'iconfont icon-danju',
                '5': 'iconfont icon-baobiao',
            }
        }
    },
    // 界面一加载的时候，就获取左侧菜单的数据
    created() {
        this.getMenuList()
    },
    methods:{
        logout() {
            this.$message.success('退出登录成功');
            window.sessionStorage.clear();
            this.$router.push("/login");
        },
        getMenuList() {
            // 加载菜单数据
            // const {data: res} = await this.$http.get('http');
            // if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            //console.log(res)

            // 挂载到页面data里面去
            this.menuList = [
                {'id': 1,
                'authName': '用户管理',
                'path': '',
                'children': [
                    {'id': 11,
                    'authName': '用户列表',
                    'path': '',
                    'children': '',},
                ],},
                {'id': 2,
                'authName': '权限管理',
                'path': '',
                'children': [
                    {'id': 21,
                    'authName': '角色列表',
                    'path': '',
                    'children': '',},
                    {'id': 22,
                    'authName': '权限列表',
                    'path': '',
                    'children': '',},
                ],},
                {'id': 5,
                'authName': '商品管理',
                'path': '',
                'children': [
                    {'id': 51,
                    'authName': '商品列表',
                    'path': '',
                    'children': '',},
                    {'id': 52,
                    'authName': '分类参数',
                    'path': '',
                    'children': '',},
                    {'id': 53,
                    'authName': '商品分类',
                    'path': '',
                    'children': '',},
                ],},
                {'id': 3,
                'authName': '订单管理',
                'path': '',
                'children': [
                    {'id': 31,
                    'authName': '订单列表',
                    'path': '',
                    'children': '',},
                ],},
                {'id': 4,
                'authName': '数据管理',
                'path': '',
                'children': [
                    {'id': 41,
                    'authName': '数据报表',
                    'path': '',
                    'children': '',},
                ],},
            ]
        },
    }
}
</script>

<style lang="less" scoped>

.home-container{
    height: 100%;
}

.el-header{
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 10px;
    color: #fff; //设置文本颜色
    font-size: 20px;
    //嵌套 CSS 布局
    > div {
        display: flex;
        align-items: center;
        img{
            width: 50px;
            height: 50px;
        }
        span {
            margin-left: 15px;
        }
    }
}

.el-aside{
    background-color: #333744;
    .el-menu{
        //去掉右边的 1 个像素的边
        border-right: none;
    }
}

.el-main{
    background-color: #eaedf1;
}

.iconfont{
    margin-right: 10px;
}
</style>