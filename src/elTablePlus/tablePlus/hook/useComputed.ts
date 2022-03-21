/*
 * 表格组件和卡片组件的计算属性hook
 * @Author: chenle 
 * @Date: 2021-09-22 16:22:11 
 * @Last Modified by: chenle
 * @Last Modified time: 2021-11-18 13:58:52
 */

import { computed } from "vue";
export function useComputed() {
  const computedOption = computed(() => (value: string | number, item: any) => {
    return computedOptions(value, item);
  });

  const computedTag = computed(() => (value: string | number, item: any) => {
    return computedTags(value, item)
  });

  const computedButton = computed(() => (rowData: any, item: any) => {
    return computedButtons(rowData, item)
  });

  // 获取过滤项
  const computedFilterProp = computed(() => (column: any) => {
    let propObj: any = {};
    if (Array.isArray(column.props)) {
      // 首先判断单元格prop的数量
      if (column.props.length === 1) {
        propObj = column.props[0];
      } else if (column.props.length > 1) {
        // 如果数量在两个以上，则需要用户使用(filterItem: true)指定过滤项，未指定则取第一个
        let iResult: any[] = [];
        iResult = column.props.filter((item: any) => {
          return item.filterItem;
        });
        // 如果设置了一个或多个过滤项则取过滤后的第一个，如果没设置则取props第一个prop
        propObj = iResult.length ? iResult[0] : column.props[0];
      }
    } else {
      propObj = column.props;
    }
    return propObj;
  });

  const computedProp = computed(() => (hItem: any) => {
    let propList: any[] = [];
    if (Array.isArray(hItem.props)) {
      propList = hItem.props;
    } else {
      propList.push(hItem.props);
    }
    return propList;
  });

  return {
    computedOption,
    computedTag,
    computedButton,
    computedFilterProp,
    computedProp
  };
}

/**
 * 根据value值找到数组或者对象中对应的label值
 * @param value 数据
 * @param item headerList对象
 * @returns value所对应的label值
 */
export function computedOptions(value: string | number, item: any) {
  let val: any = '';
  const params: any = item.options;

  if (Array.isArray(params)) {
    for (const i in params) {
      const vName = item.valueName ? params[i][item.valueName] : params[i].value;
      const lName = item.labelName ? params[i][item.labelName] : params[i].label;
      val = value == vName ? lName : value;
      if (value == vName) {
        val = lName;
        break;
      } else {
        val = value;
      }
    }
  } else {
    val = params[value];
  }
  return val;
}

/**
 * 获取tag标签类型
 * @param value 数据
 * @param item headerList对象
 * @returns 
 */
export function computedTags(value: string | number, item: any) {
  const levelMap: any = {};
  const params: any = item.options || [];
  for (const i in params) {
    levelMap[params[i].value] = params[i].tag;
  }
  return levelMap[value];
}

/**
 * 通过某个字段值计算按钮是否显示
 * @param rowData 当前行数据
 * @param item 按钮数据
 */
export function computedButtons(rowData: any, item: any) {
  let flag = true;
  if (item.filter) {
    item.filter.forEach((fItem: any) => {
      const valueList = fItem.value ? fItem.value.split(',') : '';
      if (valueList) {
        valueList.forEach((vItem: any) => {
          if (rowData[fItem.prop] == vItem) {
            flag = false;
          }
        });
      }
    });
  }
  return flag;
}