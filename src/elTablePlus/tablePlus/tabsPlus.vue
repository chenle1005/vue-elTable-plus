/*
 * 卡片组件，主要目的是为了兼容移动端
 * @Author: chenle 
 * @Date: 2021-09-23 11:15:01 
 * @Last Modified by: chenle
 * @Last Modified time: 2022-02-11 15:37:42
 */

<template>
  <div class="cl-tabs-plus">
    <div class="tabs-list">
      <el-row :gutter="10" class="el-row" type="flex">
        <el-col
          v-for="(lItem, lIndex) in tableLists"
          :key="lItem.label + lIndex"
          :span="isPC ? 12 : 24"
          class="el-col"
        >
          <div :class="isPC ? 'tabs-item' : 'mobile-tabs-item'">
            <el-descriptions
              class="margin-top"
              :column="isPC ? 2 : 1"
              size="small"
              border
            >
              <template #title>
                <el-checkbox
                  v-model="lItem.checked"
                  :label="'序号：' + (lIndex + 1)"
                  @change="tabsCheckedChange($event, lItem, lIndex)"
                ></el-checkbox
              ></template>
              <template #extra>
                <!-- button按钮 -->
                <ExpandButton
                  v-if="
                    headerList[headerList.length - 1].props.type == 'button'
                  "
                  :prop-data="headerList[headerList.length - 1].props"
                  :row-data="lItem"
                  :state="state"
                  :index="lIndex"
                  @buttonClick="buttonClick"
                ></ExpandButton>
              </template>
              <div>
                <el-descriptions-item
                  v-for="(hItem, hIndex) in headerLists"
                  :key="hItem.label + hIndex"
                  :label="hItem.label"
                  label-class-name="label-class"
                  :class-name="isPC ? 'content-class' : ''"
                >
                  <div :style="hItem.style">
                    <div
                      v-for="(pItem, pIndex) in computedProp(hItem)"
                      :key="pIndex"
                    >
                      <!-- TODO 暂时不支持局部过滤 -->
                      <!-- <template v-if="hItem.filters" #label>
										<cl-select
											v-if="hItem.options || pItem.type === 'switch'"
											:header-data="hItem"
											@headerFilterChange="headerFilterChange"
										></cl-select>
										<cl-date-picker
											v-else-if="hItem.filtersType === 'date'"
											:header-data="hItem"
											@headerFilterChange="headerFilterChange"
										></cl-date-picker>
										<cl-input v-else :header-data="hItem" @headerFilterChange="headerFilterChange"></cl-input>
									</template> -->
                      <!-- 图片组件 -->
                      <ExpandImage
                        v-if="pItem.type === 'image'"
                        :prop-data="pItem"
                        :row-data="lItem"
                      ></ExpandImage>
                      <div
                        v-else-if="pItem.type === 'slot'"
                        class="text-hidden"
                      >
                        <slot
                          :name="hItem.slotName"
                          :slotData="lItem"
                          :index="lIndex"
                        ></slot>
                      </div>
                      <!-- filter过滤 -->
                      <ExpandFilter
                        v-else-if="pItem.type === 'filter'"
                        :prop-data="pItem"
                        :row-data="lItem"
                      ></ExpandFilter>
                      <!-- tag标签 -->
                      <ExpandTag
                        v-else-if="pItem.type === 'tag'"
                        :prop-data="pItem"
                        :row-data="lItem"
                      ></ExpandTag>
                      <!-- switch开关 -->
                      <ExpandSwitch
                        v-else-if="pItem.type == 'switch'"
                        :prop-data="pItem"
                        :row-data="lItem"
                        :state="state"
                        :index="lIndex"
                        @switchChange="switchChange"
                      ></ExpandSwitch>
                      <!-- 可编辑单元格 -->
                      <ExpandEditable
                        v-else-if="
                          pItem.type === 'editable' || pItem.type === 'tag'
                        "
                        :prop-data="pItem"
                        :row-data="lItem"
                        :state="state"
                        :index="lIndex"
                      ></ExpandEditable>
                      <ExpandText
                        v-else
                        :prop-data="pItem"
                        :row-data="lItem"
                      ></ExpandText>
                    </div>
                  </div>
                </el-descriptions-item>
              </div>
            </el-descriptions>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang='ts'>
import {
  ref,
  reactive,
  toRefs,
  onMounted,
  onBeforeMount,
  computed,
  watch,
} from "vue";
import ExpandImage from "./components/ExpandImage";
import ExpandFilter from "./components/ExpandFilter";
import ExpandTag from "./components/ExpandTag";
import ExpandSwitch from "./components/ExpandSwitch";
import ExpandEditable from "./components/ExpandEditable";
import ExpandButton from "./components/ExpandButton";
import ExpandText from "./components/ExpandText";
import { Local } from "@/utils/storage";
import ExpandSelect from "./filters/ExpandSelect";
import ExpandInput from "./filters/ExpandInput";
import ExpandDatePicker from "./filters/ExpandDatePicker";
import { useComputed } from "./hook/useComputed";
import { useFilters } from "./hook/useFilters";
import { useMethod } from "./hook/useMethod";
export default {
  name: "tabs-plus",
  components: {
    ExpandImage,
    ExpandFilter,
    ExpandTag,
    ExpandSwitch,
    ExpandEditable,
    ExpandButton,
    ExpandText,
    ExpandSelect,
    ExpandInput,
    ExpandDatePicker,
  },
  props: {
    // 表格的配置数据
    computedTableHeight: {
      type: Number,
      default: 0,
    },
    // 表格的配置数据
    tableConfig: {
      type: Object,
      default: () => {},
    },
    // 表格数据
    tableList: {
      type: Array,
      default: () => [],
    },
  },
  setup(props: any, { emit }: any) {
    const multipleTable = ref();
    const state = reactive({
      visible: false,
      headerList: [],
      tableLists: [] as any,
      editableIndex: -1, // 可编辑单元格的下标标识
      isPC: Local.get("isPC"),
    });

    /**
     * 多选框change事件
     * @param value 复选项当前值
     * @param rowData 当前行数据
     * @param index 当前行下标值
     */
    const tabsCheckedChange = (value: any, rowData: any, index: number) => {
      let selectList = state.tableLists.filter(
        (item: { checked: any }) => item.checked
      );
      emit("handleSelectionChangeTab", selectList);
    };

    // 过滤被隐藏的列同时删除操作列
    const headerLists = computed(() => {
      return state.headerList.filter(
        (column: any) => !column.hidden && column.type !== "button"
      );
    });

    // 表格组件和卡片组件的计算属性hook
    const { computedFilterProp, computedProp } = useComputed();

    // 局部过滤hook
    const { headerFilterChange } = useFilters(state, props);

    // 表格组件和卡片组件的公共方法（包括点击事件及组件的回调事件）
    const { switchChange, buttonClick, summaryMethod } = useMethod(
      state,
      props,
      emit
    );

    watch(
      () => [props.tableConfig, props.tableList],
      ([newTableConfig, newTableList]) => {
        state.headerList = newTableConfig.headerList;
        state.tableLists = newTableList;
      },
      { immediate: true, deep: true }
    );
    onMounted(() => {});
    // 页面加载前
    onBeforeMount(() => {});
    return {
      tabsCheckedChange,

      headerLists,
      multipleTable,

      computedFilterProp,
      computedProp,

      headerFilterChange,

      switchChange,
      buttonClick,
      summaryMethod,
      ...toRefs(state),
      state,
    };
  },
};
</script>
<style scoped lang='scss'>
</style>