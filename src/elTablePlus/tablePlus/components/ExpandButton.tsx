import { defineComponent, reactive } from "vue";
import { computedButtons } from '../hook/useComputed';
import ExpandIcons from '../../components/ExpandIcons';

export default defineComponent({
  components: { ExpandIcons },
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
    propData: {
      type: Object,
      default: () => { }
    }
  },
  emits: ["buttonClick"],
  setup(props, { emit }) {
    const state = reactive({
    })

    const buttonClick = (
      rowData: object, item: any, index: number
    ) => {
      emit('buttonClick', rowData, item, index)
    }

    // 按钮类型组件
    const Buttons = (bItem: any, bIndex: number) => {
      // TODO 按钮波浪指令暂未添加
      // v-waves="'light'"
      return (
        <el-button
          key={bIndex}
          disabled={bItem.disabled}
          type={bItem.type}
          style={bItem.style || {}}
          size={bItem.size || 'mini'}
          icon={bItem.effect === 'editable' ?
            (props.state.editableIndex !== props.index ? bItem.icon[0] : bItem.icon[1])
            : bItem.icon || ''}
          onClick={(e: any) => {
            e.stopPropagation()
            buttonClick(props.rowData, bItem, props.index)
          }}
        >
          {/* <el-icon color="#409EFC">
            <component is="Edit"></component>
          </el-icon> */}
          {props.propData.buttonType === 'tooltip' ? '' :
            <span
            // style={{ marginLeft: '5px' }}
            >
              {bItem.effect === 'editable' ? (props.state.editableIndex !== props.index ? bItem.text[0] : bItem.text[1]) : bItem.text || ''}
            </span>
          }
        </el-button>
      )
    }

    // 链接型按钮组件
    const LinkButtons = (bItem: any, bIndex: number, divider?: boolean) => {
      return (
        <>
          <span
            style={{ margin: '0 5px' }}
          >
            <el-link
              key={bIndex}
              href={bItem.href || 'javascript:void'}
              disabled={bItem.disabled}
              type={bItem.type}
              style={bItem.style || {}}
              underline={bItem.underline || false}
              icon={bItem.effect === 'editable' ? (props.state.editableIndex !== props.index ? bItem.icon[0] : bItem.icon[1]) : bItem.icon || ''}
              onClick={(e: any) => {
                e.stopPropagation()
                buttonClick(props.rowData, bItem, props.index)
              }}
            >
              {bItem.effect === 'editable' ? (props.state.editableIndex !== props.index ? bItem.text[0] : bItem.text[1]) : bItem.text || ''}
            </el-link>
          </span>
          {divider ? <el-divider direction="vertical"></el-divider> : ''}
        </>
      )
    }

    // 有文字提示型按钮组件
    const TooltipButtons = (bItem: any, bIndex: number) => {
      return (
        <el-tooltip
          effect={props.propData.tooltipEffect || 'dark'}
          content={bItem.effect === 'editable' ? (props.state.editableIndex !== props.index ? bItem.text[0] : bItem.text[1]) : bItem.text || ''}
          placement={bItem.tooltipPlacement || props.propData.tooltipPlacement || 'top'}
        >
          {Buttons(bItem, bIndex)}
        </el-tooltip>
      )
    }

    // 更多按钮组件
    const MoreButtons = (bItem: any, bIndex: number) => {
      if (props.propData.buttonType === 'link') {
        return (
          <el-dropdown v-slots={{
            dropdown: () => {
              return (
                <>
                  <el-dropdown-menu>
                    {bItem.btnList.map((bMItem: any, bMIndex: number) => {
                      return (
                        <>
                          {
                            computedButtons(props.rowData, bMItem) ?
                              <el-dropdown-item>
                                {LinkButtons(bMItem, bMIndex, false)}
                              </el-dropdown-item>
                              : ''
                          }
                        </>
                      )
                    })}
                  </el-dropdown-menu>
                </>
              )
            }
          }}
          >
            {LinkButtons(bItem, bIndex, props.propData.params.length + 1 !== bIndex)}
          </el-dropdown>
        )
      } else {
        return (
          <el-dropdown
            v-slots={{
              dropdown: () => {
                return (
                  <>
                    <el-dropdown-menu>
                      {bItem.btnList.map((bMItem: any, bMIndex: number) => {
                        return (
                          <>
                            {
                              computedButtons(props.rowData, bMItem) ?
                                <el-dropdown-item>
                                  {LinkButtons(bMItem, bMIndex, false)}
                                </el-dropdown-item>
                                : ''
                            }
                          </>
                        )
                      })}
                    </el-dropdown-menu>
                  </>
                )
              }
            }}
          >
            {Buttons(bItem, bIndex)}
          </el-dropdown>
        )
      }
    }

    // 按钮的循环体以及判断该按钮是否展示
    const ButtonMap = () => {
      return (
        <>
          {props.propData.params.map((bItem: any, bIndex: number) => {
            if (bItem.btnList) {
              return (
                MoreButtons(bItem, bIndex)
              )
            } else {
              return (
                <>
                  {
                    computedButtons(props.rowData, bItem) ?
                      ButtonType(bItem, bIndex)
                      : ''
                  }
                </>
              )
            }
          })}
        </>
      )
    }

    // 判断按钮类型
    const ButtonType = (bItem: any, bIndex: number) => {
      if (props.propData.buttonType === 'link') {
        return (
          LinkButtons(bItem, bIndex, props.propData.params.length - 1 !== bIndex)
        )
      } else if (props.propData.buttonType === 'tooltip') {
        return (
          TooltipButtons(bItem, bIndex)
        )
      } else {
        return (
          Buttons(bItem, bIndex)
        )
      }
    }

    return () => (
      <>
        {
          props.propData.buttonType === 'group' ?
            <el-button-group>
              {ButtonMap()}
            </el-button-group>
            :
            ButtonMap()
        }
      </>
    )
  }
})