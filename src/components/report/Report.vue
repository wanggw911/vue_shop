<template>
    <div>
        <!-- 面包屑 导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片试图区域 -->
        <el-card class="box-card">
            <!-- 2、准备好一个 dom -->
            <div id='main' style="width: 600px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
//1、导入echarts
import echarts from 'echarts'

export default {
    data() {
        return {
            
        }
    },
    created() {
        // 获取所有的权限
        //this.getCategoryList()
    },
    //此时，页面上的元素，已经被渲染完毕
    mounted() {
        // 3、基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'))
// 指定图表的配置项和数据
        var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },
    methods: {
        // 获取权限列表
        async getCategoryList() {
            const {data: res} = await this.$http.get('rights/list')
            if (res.meta.status !== 200) {
                return this.$message.error('获取权限列表失败！')
            }
            
            this.categoryList = res.data
            console.log('获取权限列表成功！')
            console.log(res.data)
        },
    }
}
</script>

<style lang="less" scoped>
</style>