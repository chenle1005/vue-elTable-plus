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

    const datePickerRef = ref()

    const state = reactive({
      // value: newDate(),
      value: '',
      visible: false,
      defaultTime: [
        new Date(2000, 1, 1, 0, 0, 0),
        new Date(2000, 2, 1, 23, 59, 59)
      ]
    })

    const datePickerChange = (value: any) => {
      if (!value) state.value = ''
      emit('headerFilterChange', value, props.headerData, props.propData)
    }

    const dataPickerBlur = () => {
      state.visible = false
    }

    const lebelClick = () => {
      state.visible = true
      datePickerRef.value.focus()
    }

    return () => (
      <span
        style={
          state.value
            ? {
              color: '#409EFF',
            }
            : {}
        }
        onClick={lebelClick}
      >
        {props.headerData.label}
        <el-icon class={['el-icon--right']}>
          {state.visible ? <arrow-up-bold /> : <arrow-down-bold />}
        </el-icon>
        <el-date-picker
          v-model={state.value}
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm:ss"
          default-time={state.defaultTime}
          ref={datePickerRef}
          class="date_style"
          size="mini"
          onChange={datePickerChange}
          onBlur={dataPickerBlur}
        >
        </el-date-picker>
      </span>
    );
  },
});