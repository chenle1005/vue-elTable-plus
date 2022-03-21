import { defineComponent } from "vue";
import ExpandImage from './ExpandImage';
import ExpandFilter from './ExpandFilter';
import ExpandTag from './ExpandTag';
import ExpandSwitch from './ExpandSwitch';
import ExpandEditable from './ExpandEditable';
import ExpandButton from './ExpandButton';
import ExpandText from './ExpandText';
import { computedOptions, computedTags } from '../hook/useComputed';

export default defineComponent({
  components: {
    ExpandImage,
    ExpandFilter,
    ExpandTag,
    ExpandSwitch,
    ExpandEditable,
    ExpandButton,
    ExpandText
  },
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
    headerData: {
      type: Object,
      default: () => { }
    }
  },
  setup(props) {

    const renderContent = (pItem: any, pIndex: number) => {
      if (pItem.type === 'image') {
        // 图片组件
        <ExpandImage header-data={pItem} row-data={props.rowData}></ExpandImage>
      }
    }

    return () => (
      <>
        {props.headerData.prop.map((pItem: any, pIndex: number) => {
          { renderContent(pItem, pIndex) }
        })}
      </>
    )
  }
})