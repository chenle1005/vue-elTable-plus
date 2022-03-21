import { defineComponent } from "vue";

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
        {props.rowData[props.propData.prop] || (props.rowData[props.propData.prop] == '0' ? '0' : props.propData.emptyText || '-')}
      </div>
    )
  }
})