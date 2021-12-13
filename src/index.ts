import type { App } from 'vue';
import { SFCWithInstall } from '../types/table-plus'
import elTablePlus from "./src/elTablePlus/index.vue"
elTablePlus.install = (app: App, option: {}): void => {
  app.component(elTablePlus.name, elTablePlus)

  app.provide('elTablePlus', option)
}
const _elTablePlus = elTablePlus as SFCWithInstall<typeof elTablePlus>

export default _elTablePlus