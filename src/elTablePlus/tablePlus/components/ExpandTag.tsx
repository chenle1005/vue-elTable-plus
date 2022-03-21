import { defineComponent } from "vue";
import { computedOptions, computedTags } from '../hook/useComputed';

export default defineComponent({
  props: {
    rowData: {
      type: Object,
      default: () => { }
    },
    index: Number,
    propData: {
      type: Object,
      default: () => { }
    }
  },
  setup(props) {

    return () => (
      <div class="text-hidden">
        <el-tag size="small" type={computedTags(props.rowData[props.propData.prop], props.propData)}>
          {computedOptions(props.rowData[props.propData.prop], props.propData)}
        </el-tag>
      </div>
    )
  }
})