import { defineComponent } from "vue";
import { useMethod } from '../hook/useMethod';

export default defineComponent({
  props: {
    state: {
      type: Object,
      default: () => { }
    },
    rowData: {
      type: Object,
      default: () => { }
    },
    index: {
      type: Number,
      default: () => { }
    },
    propData: {
      type: Object,
      default: () => { }
    }
  },
  setup(props, { emit }) {
    // 表格组件和卡片组件的公共方法（包括点击事件及组件的回调事件）
    const switchChange = (
      rowData: object,
      prop: string,
      active: number | string | boolean = 1,
      inactive: number | string | boolean = 0,
      index: number
    ) => {
      emit('switchChange', rowData, prop, active, inactive, index)
    }

    return () => (
      <div>
        <el-switch
          v-model={props.rowData[props.propData.prop]}
          disabled={props.propData.params.disabled || false}
          active-color={props.propData.params.activeColor || '#409EFF'}
          inactive-color={props.propData.params.inactiveColor || '#C0CCDA'}
          active-value={props.propData.params.activeValue || 1}
          inactive-value={props.propData.params.inactiveValue || 0}
          onClick={(e: any) => {
            e.stopPropagation()
            switchChange(
              props.rowData, props.propData.prop, props.propData.params.activeValue, props.propData.params.inactiveValue, props.index
            )
          }}
        />
      </div>
    )
  }
})