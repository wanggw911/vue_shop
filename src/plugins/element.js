import Vue from 'vue'
import { 
    Button, Form, FormItem, Input, Message, Container, Header, Aside, 
    Main, Menu, Submenu, MenuItem, 
    Breadcrumb, BreadcrumbItem, 
    Card,
    Row, Col
} from 'element-ui'

// 注册成全局可以用的组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)

Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)

Vue.use(Card)

Vue.use(Row)
Vue.use(Col)

Vue.prototype.$message = Message
