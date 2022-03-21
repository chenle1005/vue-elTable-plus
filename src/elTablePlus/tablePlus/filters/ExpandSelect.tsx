import { defineComponent, ref, reactive, watch, Transition } from "vue";

//定义props的类型
interface Props {
  headerData: any,
  propData: any
}

export default defineComponent({
  props: {
    // 表头数据
    headerData: {
      type: Object,
      default: () => { },
    },
    // prop数据
    propData: {
      type: Object,
      default: () => { },
    }
  },
  emits: ["headerFilterChange"],
  setup(props: Props, { emit }) {

    const state = reactive({
      value: [],
      options: [],
      selectVisible: false,
      visible: false
    })

    const selectVisibleChange = (e: boolean) => {
      if (!e) {
        state.visible = false
      } else {
        state.selectVisible = e
      }
    }

    const selectChange = (val: any) => {
      if (!val.length) val = ''
      emit('headerFilterChange', val, props.headerData, props.propData)
    }

    const slots = {
      reference: (e: any) => {
        return (
          <span
            style={
              state.value.length
                ? {
                  color: '#409EFF',
                }
                : {}
            }
            onClick={() => { state.visible = !state.visible }}
          >
            {props.headerData.label}

            <el-icon class={['el-icon--right']}>
              {state.visible ? <arrow-up-bold /> : <arrow-down-bold />}
            </el-icon>
          </span>
        );
      },
    };

    watch(
      props.propData,
      (newProps: any, oldProps) => {
        if (newProps.options) {
          if (Array.isArray(newProps.options)) state.options = newProps.options
          else {
            const arr: any = []
            for (const key in newProps.options) {
              arr.push({
                label: newProps.options[key],
                value: key,
              });
            }
            state.options = arr
          }
        } else if (props.propData.type === 'switch') {
          const arr: any = []
          arr.push({
            label: '开启',
            value: props.propData.params.activeValue,
          }, {
            label: '关闭',
            value: props.propData.params.inactiveValue,
          });
          state.options = arr
        }
      },
      { immediate: true, deep: true }
    );
    return () => (
      <el-popover
        v-model={[state.visible, 'visible']}
        placement="bottom-start"
        width="{400}"
        trigger="manual"
        v-slots={slots}
      >
        <el-select
          v-model={state.value}
          multiple
          collapse-tags
          placeholder="请选择"
          size="mini"
          onVisibleChange={selectVisibleChange}
          onChange={selectChange}
        >
          {state.options.map((item: any, index: number) => {
            return (
              <el-option
                key={index}
                label={props.headerData.labelName ? item[props.headerData.labelName] : item.label}
                value={props.headerData.valueName ? item[props.headerData.valueName] : item.value}>
              </el-option>
            );
          })}
        </el-select>
      </el-popover>
    );
  },
});