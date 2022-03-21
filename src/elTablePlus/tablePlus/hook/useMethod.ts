/*
 * 表格组件和卡片组件的公共方法（包括点击事件及组件的回调事件）
 * @Author: chenle 
 * @Date: 2021-09-22 16:38:09 
 * @Last Modified by: chenle
 * @Last Modified time: 2021-09-22 16:43:46
 */

import { ElMessageBox, ElMessage } from 'element-plus';
export function useMethod(state: any, props: any, emit: any) {
  /**
     * 当选择项发生变化时会触发该事件
     * @param res 选择的行数据
     */
  const handleSelectionChange = (res: Object[]) => {
    emit('handleSelectionChange', res);
  };
  /**
   * 修改开关的回调事件
   * @param rowData 当前行数据
   * @param prop 该开关的prop值
   * @param active switch 打开时的值，默认为1(number)
   * @param inactive switch 关闭时的值，默认为0(number)
   * @param index 当前行的下标值
   */
  const switchChange = (
    rowData: object,
    prop: string,
    active: number | string | boolean = 1,
    inactive: number | string | boolean = 0,
    index: number
  ) => {
    emit('switchChange', rowData, prop, active, inactive, index);
  };
  /**
   * 按钮的点击事件
   * @param rowData 当前行数据
   * @param item 当前按钮数据
   * @param index 当前行下标值
   */
  const buttonClick = (rowData: object, item: any, index: number) => {
    if (item.effect === 'editable') {
      if (state.editableIndex !== index) {
        state.editableIndex = index;
      } else {
        ElMessageBox.confirm('是否要继续修改该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'cancelButton',
          confirmButtonClass: 'confirmButton',
          type: 'warning',
        })
          .then((response) => {
            state.editableIndex = -1;
            emit('buttonClick', rowData, item, index);
          })
          .catch((err) => {
            state.editableIndex = -1;
          });
      }
    } else {
      emit('buttonClick', rowData, item, index);
    }
  };

  /**
   * 自定义合计的默认计算方法
   */
  const summaryMethod = (param: any) => {
    const { columns, data } = param;

    const sums: any[] = [];
    columns.forEach((column: any, index: number) => {
      if (index === 0) {
        sums[index] = '合计';
        return;
      }

      var substr = column.label.substring(column.label.indexOf('(') + 1, column.label.indexOf(')'));
      if (props.tableConfig.summaryProp.indexOf(column.property) > -1) {
        const values = data.map((item: any) => Number(item[column.property]));
        if (!values.every((value: any) => isNaN(value))) {
          sums[index] = values.reduce((prev: any, curr: any) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = sums[index].toFixed(props.tableConfig.sumToFixed || 2) + ' ' + substr;
        } else {
          sums[index] = '-';
        }
      } else {
        sums[index] = '-';
      }
    });
    return sums;
  };

  return {
    handleSelectionChange,
    switchChange,
    buttonClick,
    summaryMethod
  }
}