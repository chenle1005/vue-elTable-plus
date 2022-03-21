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
      <div>
        <el-image
          src={props.rowData[props.propData.prop]}
          preview-src-list={props.propData.params.preview ? [props.rowData[props.propData.prop]] : []}
          lazy={props.propData.params.lazy || false}
          z-index={props.propData.params.zIndex || 2000}
          style={props.propData.params.style || {}}
          fit={props.propData.params.fit || 'cover'}
        />
      </div>
    )
  }
})