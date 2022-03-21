import { createApp } from "vue"
import App from "./App.vue"

import '@/theme/index.scss';

import ElementPlus from "element-plus"
import * as ElIcons from '@element-plus/icons-vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'

const app = createApp(App);

Object.keys(ElIcons).forEach((key: any) => {

  /*
   * 以elIcon为前缀的命名规则，是为了适配已经使用属性名添加图标的内置组件，
   * 例如：<el-button icon="Refresh"></el-button>
   */
  app.component(key, (ElIcons as any)[key])
})

app
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount('#app');

// directives(app);