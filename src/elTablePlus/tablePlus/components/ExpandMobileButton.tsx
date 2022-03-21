import { defineComponent, reactive, watch } from "vue";
import { computedButtons } from '../hook/useComputed';

export default defineComponent({
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
      outButtonList: [] as any,
      moreButtonList: [] as any
    })

    const buttonClick = (
      rowData: object, item: any, index: number
    ) => {
      emit('buttonClick', rowData, item, index)
    }

    const getBtnList = (list: any) => {
      list.filter((item: any) => {
        if (item.btnList) {
          getBtnList(item.btnList)
        } else {
          if (item.mobileShowOut && item.mobileShowOut != undefined) {
            state.outButtonList.push(item)
          } else {
            state.moreButtonList.push(item)
          }
        }
      })
    }

    watch(
      props.propData,
      (newProps: any, oldProps) => {
        const mBtnParams = newProps.mobileBtnParams;
        getBtnList(newProps.params)
        state.outButtonList.push({
          text: mBtnParams.text === undefined ? '操作' : mBtnParams.text,
          type: mBtnParams.type || 'primary',
          icon: mBtnParams.icon || 'el-icon-edit-outline',
          style: mBtnParams.style || {}
        })
      },
      { immediate: true, deep: true }
    );

    // 链接型按钮组件
    const LinkButtons = (bItem: any, bIndex: number) => {
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
        </>
      )
    }

    // 更多按钮组件
    const MoreButtons = (bItem: any, bIndex: number) => {
      return (
        <el-dropdown v-slots={{
          dropdown: () => {
            return (
              <>
                <el-dropdown-menu>
                  {state.moreButtonList.map((bMItem: any, bMIndex: number) => {
                    return (
                      <>
                        {
                          computedButtons(props.rowData, bMItem) ?
                            <el-dropdown-item>
                              {LinkButtons(bMItem, bMIndex)}
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
          {LinkButtons(bItem, bIndex)}
        </el-dropdown>
      )
    }

    // 按钮的循环体以及判断该按钮是否展示
    const ButtonMap = () => {
      return (
        <>
          {state.outButtonList.map((bItem: any, bIndex: number) => {
            if (state.outButtonList?.length - 1 === bIndex) {
              return (
                <>
                  {MoreButtons(bItem, bIndex)}
                </>
              )
            } else {
              return (
                <>
                  {
                    computedButtons(props.rowData, bItem) ?
                      LinkButtons(bItem, bIndex)
                      : ''
                  }
                </>
              )
            }
          })}
        </>
      )
    }

    return () => (
      <>
        {
          ButtonMap()
        }
      </>
    )
  }
})