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
        <slot name={props.propData.slotName} slotData={props.rowData} index={props.index}></slot>
      </div>
    )
  }
})