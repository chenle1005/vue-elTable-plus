import { defineComponent } from "vue";
import { computedOptions } from '../hook/useComputed';

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
        { computedOptions(props.rowData[props.propData.prop], props.propData)}
      </div>
    )
  }
})