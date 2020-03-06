import Vue from 'vue'
import { Button } from 'element-ui'
// 导入需要使用到的组件
import { Form, FormItem } from 'element-ui'
import { Input } from 'element-ui'
// 导入弹框提示
import { Message } from 'element-ui'

// 注册成全局可以用的组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
