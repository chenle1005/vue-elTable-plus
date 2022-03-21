import { defineComponent } from "vue";
import * as Icons from "@element-plus/icons-vue";

export default defineComponent({
  name: "ElIcons",
  components: Icons,
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#000000",
    },
  },
  setup(props) {
    console.log(props.name);

    return () => (
      <el-icon size={props.size} color={props.color}>
        <component is={props.name}></component>
      </el-icon>
    )
  }
})