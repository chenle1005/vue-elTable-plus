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
      visible: false
    })

    const inpputChange = () => {
      state.visible = false
      emit('headerFilterChange', state.value, props.headerData, props.propData)
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

    const btnSlots = {
      append: (e: any) => {
        return (
          <el-button icon="Search" onClick={inpputChange}></el-button>
        );
      },
    };

    watch(
      props.headerData,
      (newProps, oldProps) => {
        state.options = newProps.options ? newProps.options : [];
      },
      { immediate: true, deep: true }
    );
    return () => (
      <el-popover
        v-model={[state.visible, 'visible']}
        placement="bottom-start"
        width="{400}"
        trigger="click"
        v-slots={slots}
      >
        <el-input
          placeholder="请输入内容"
          v-model={state.value}
          size="mini"
          clearable
          class="input-with-select"
          v-slots={btnSlots}
        >
        </el-input>
      </el-popover>
    );
  },
});