/*
 * 局部过滤hook
 * @Author: chenle 
 * @Date: 2021-09-22 16:31:33 
 * @Last Modified by: chenle
 * @Last Modified time: 2021-12-14 14:35:01
 */

import { compare } from '@/utils/formatTime';
export function useFilters(state: any, props: any) {
  /**
     * 数据过滤使用的方法，如果是多选的筛选项，对每一条数据会执行多次，任意一次返回 true 就会显示。
     */
  const headerFilterChange = (value: any, column: any, propData: any) => {
    const tableLists = props.tableList;
    let tableData: any[] = [];

    if (!value) {
      state.tableLists = tableLists;
      return false;
    }
    if (propData.options || propData.type === 'switch') {
      tableData = tableLists.filter((item: any) => {
        let isShow = value.some((prop: any) => {
          return item[propData.prop] == prop;
        });
        return isShow;
      });
      // TODO 暂时无法并列过滤数据
      // state.tableLists = [...state.tableLists, ...tableData];
    } else if (column.filtersType === 'date') {
      tableData = tableLists.filter((item: any) => {
        return compare(item[propData.prop], value[0], value[1]);
      });
    } else {
      tableData = tableLists.filter((item: any) => {
        return item[propData.prop] && item[propData.prop].indexOf(value) >= 0;
      });
    }
    state.tableLists = tableData;
  };
  return {
    headerFilterChange
  }
}