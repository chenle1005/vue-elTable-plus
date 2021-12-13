import { createApp } from "vue"
import App from "./App.vue"

import ElementPlus from "element-plus"
// import powerfulTable from "../lib/powerful-table.umd.min.js"
// import powerfulTable from 'el-plus-powerful-table-ts'
import en from 'element-plus/lib/locale/lang/en'

import "element-plus/lib/theme-chalk/index.css"

const app = createApp(App)
app.use(ElementPlus)
app.mount("#app")