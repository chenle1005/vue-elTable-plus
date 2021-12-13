import { VNode, Plugin, App } from "@vue/runtime-core"

declare module 'vue-eltable-plus' {
  const elTablePlus: {
    install: (app: App<any>, opt: any) => void;
  }
  export default elTablePlus
}

export type SFCWithInstall<T> = T & Plugin