import { defineComponent } from "vue";
import { computedOptions } from '../hook/useComputed';

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
    index: Number,
    propData: {
      type: Object,
      default: () => { }
    }
  },
  setup(props) {

    const inputSlot = {
      prepend: (e: any) => {
        if (props.propData.params && props.propData.params.prepend) {
          return (
            <div>
              {props.propData.params.prepend}
            </div>
          )
        }
      },
      append: (e: any) => {
        if (props.propData.params && props.propData.params.append) {
          return (
            <div>
              {props.propData.params.append}
            </div>
          )
        }
      }
    }

    const renderContent = () => {
      if (props.propData.editType === 'input' && props.state.editableIndex === props.index) {
        return (
          <div>
            <el-input
              v-model={props.rowData[props.propData.prop]}
              style={(props.propData.params && props.propData.params.style) || {}}
              size={(props.propData.params && props.propData.params.size) || 'mini'}
              placeholder={(props.propData.params && props.propData.params.placeholder) || ''}
              disabled={(props.propData.params && props.propData.params.disabled) || false}
              v-slots={inputSlot}
            >
            </el-input>
          </div>
        )
      } else if (props.propData.editType == 'select' && props.state.editableIndex == props.index) {
        return (
          <div>
            {/* TODO :class="deviceIsPc ? 'w-200' : 'w-100'" */}
            <el-select
              v-model={props.rowData[props.propData.prop]}
              filterable={(props.propData.params && props.propData.params.filterable) || true}
              placeholder={'请选择' + props.propData.label}
              size={(props.propData.params && props.propData.params.size) || 'mini'}
              disabled={(props.propData.params && props.propData.params.disabled) || false}
              clearable={(props.propData.params && props.propData.params.clearable) || true}
            >
              {props.propData.options.map((item: any, index: number) => {
                return (
                  <el-option
                    key={index}
                    label={props.propData.labelName ? item[props.propData.labelName] : item.label}
                    value={props.propData.valueName ? item[props.propData.valueName] : item.value}
                    disabled={item.disabled || false}
                  />
                )
              })}
            </el-select>
          </div>
        )
      } else {
        return (
          <div>
            {defaultContent()}
          </div>
        )
      }
    }

    const defaultContent = () => {
      if (props.propData.editType === 'select' && props.state.editableIndex !== props.index) {
        return (
          <div class="text-hidden">
            {computedOptions(props.rowData[props.propData.prop], props.propData)}
          </div>
        )
      } else if (props.state.editableIndex !== props.index) {
        return (
          <div class="text-hidden">
            {props.rowData[props.propData.prop] || (props.rowData[props.propData.prop] == '0' ? '0' : props.propData.emptyText || '-')}
          </div>
        )
      }
    }

    return () => (
      <div>
        {renderContent()}
      </div>
    )
  }
})